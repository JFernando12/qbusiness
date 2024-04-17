import { Request, Response } from 'express';
import { QBusiness } from '../services/QBusiness';
import { IAM } from '../services/IAM';
import { AWS_ACCOUNT_ID } from '../config/envs';

const create = async (req: Request, res: Response) => {

  const response = await QBusiness.createApplication({
    displayName: 'application7',
    roleArn: `arn:aws:iam::${AWS_ACCOUNT_ID}:role/qbusiness-logs-test`,
    description: 'STRING_VALUE',
    tags: [
      {
        key: 'key_application1',
        value: 'value_application1',
      },
    ],
  });
  const applicationId = response.applicationId;

  // Create an index
  const responseIndex = await QBusiness.createIndex({
    applicationId: applicationId,
    displayName: applicationId + '_index1',
    tags: [
      {
        key: 'key_application1_index1',
        value: 'value_application1_index1',
      },
    ],
  })
  const indexId = responseIndex.indexId;

  // Create a retriever
  const responseRetriever = await QBusiness.createRetriever({
    applicationId: applicationId,
    type: 'NATIVE_INDEX',
    displayName: applicationId + '_retriever1',
    configuration: {
      nativeIndexConfiguration: {
        indexId: indexId,
      },
    },
    tags: [
      {
        key: 'key_application1_retriever1',
        value: 'value_application1_retriever1',
      },
    ],
  });

  // Create role
  const roleName = applicationId + '_role1';
  const responseRole = await IAM.createRole({
    AssumeRolePolicyDocument: JSON.stringify({
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AllowsAmazonQToAssumeRoleForServicePrincipal",
          "Effect": "Allow",
          "Principal": {
            "Service": "qbusiness.amazonaws.com"
          },
          "Action": "sts:AssumeRole",
          "Condition": {
            "StringEquals": {
              "aws:SourceAccount": `${AWS_ACCOUNT_ID}`
            },
            "ArnLike": {
              "aws:SourceArn": `arn:aws:qbusiness:us-east-1:${AWS_ACCOUNT_ID}:application/${applicationId}`
            }
          }
        }
      ]
    }),
    RoleName: roleName,
  });
  const roleArn = responseRole.Role?.Arn;

  // Create policy
  const policyName = applicationId + '_policy1';
  const responsePolicy = await IAM.createPolicy({
    PolicyDocument: JSON.stringify({
      "Version": "2012-10-17",
      "Statement": [{
              "Sid": "AllowsAmazonQToIngestDocuments",
              "Effect": "Allow",
              "Action": [
                  "qbusiness:BatchPutDocument",
                  "qbusiness:BatchDeleteDocument"
              ],
              "Resource": `arn:aws:qbusiness:us-east-1:${AWS_ACCOUNT_ID}:application/${applicationId}/index/${indexId}`
          },
          {
              "Sid": "AllowsAmazonQToIngestPrincipalMapping",
              "Effect": "Allow",
              "Action": [
                  "qbusiness:PutGroup",
                  "qbusiness:CreateUser",
                  "qbusiness:DeleteGroup",
                  "qbusiness:UpdateUser",
                  "qbusiness:ListGroups"
              ],
              "Resource": [
                  `arn:aws:qbusiness:us-east-1:${AWS_ACCOUNT_ID}:application/${applicationId}`,
                  `arn:aws:qbusiness:us-east-1:${AWS_ACCOUNT_ID}:application/${applicationId}/index/${indexId}`,
                  `arn:aws:qbusiness:us-east-1:${AWS_ACCOUNT_ID}:application/${applicationId}/index/${indexId}/data-source/*`
              ]
          }
      ]
  }),
    PolicyName: policyName,
  });
  const policyArn = responsePolicy.Policy?.Arn;

  // Attach policy to role
  const responseAttachRolePolicy = await IAM.attachRolePolicy({
    PolicyArn: policyArn,
    RoleName: roleName,
  });

  // Create a data source
  const responseDataSource = await QBusiness.createDataSource({
    applicationId: applicationId,
    indexId: indexId,
    displayName: applicationId + '_datasource1',
    configuration: {
      "connectionConfiguration": {
        "repositoryEndpointMetadata": {
          "BucketName": `${AWS_ACCOUNT_ID}-qbusiness-test`
        }
      },
      "repositoryConfigurations": {
        "document": {
          "fieldMappings": [
            {
              "indexFieldName": "s3_document_id",
              "indexFieldType": "STRING",
              "dataSourceFieldName": "s3_document_id"
            }
          ]
        }
      },
      "syncMode": "FULL_CRAWL",
      "type": "S3",
      "version": "1.0.0"
    },
    roleArn: roleArn,
    tags: [
      {
        key: "key_application1_datasource5",
        value: "value_application1_datasource5",
      },
    ],
  });


  res.status(201).json({ message: 'Application created', response: responseDataSource });
};

export default {
  create,
};
