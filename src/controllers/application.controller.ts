import { Request, Response } from 'express';
import { QBusiness } from '../services/QBusiness';
import { IAM } from '../services/IAM';
import { AWS_ACCOUNT_ID } from '../config/envs';

const create = async (req: Request, res: Response) => {
  const rfc = req.body.rfc;
  const description = req.body.description;

  const application = await QBusiness.createApplication({
    displayName: rfc + '_application',
    roleArn: `arn:aws:iam::${AWS_ACCOUNT_ID}:role/qbusiness-logs-test`,
    description: description || 'Application created by QBusiness API',
  });
  const applicationId = application.applicationId;

  // Create an index
  const index = await QBusiness.createIndex({
    applicationId: applicationId,
    displayName: applicationId + '_index',
  });
  const indexId = index.indexId;

  // Create a retriever
  const retriever = await QBusiness.createRetriever({
    applicationId: applicationId,
    type: 'NATIVE_INDEX',
    displayName: applicationId + '_retriever',
    configuration: {
      nativeIndexConfiguration: {
        indexId: indexId,
      },
    },
  });

  // Create role and policy
  const { roleArn } = await IAM.createRoleDataSourceS3(applicationId!, indexId!);

  // Create a data source
  const dataSource = await QBusiness.createDataSource({
    applicationId: applicationId,
    indexId: indexId,
    displayName: applicationId + '_datasource',
    configuration: {
      connectionConfiguration: {
        repositoryEndpointMetadata: {
          BucketName: `${AWS_ACCOUNT_ID}-qbusiness-test`,
        },
      },
      repositoryConfigurations: {
        document: {
          fieldMappings: [
            {
              indexFieldName: 's3_document_id',
              indexFieldType: 'STRING',
              dataSourceFieldName: 's3_document_id',
            },
          ],
        },
      },
      syncMode: 'FULL_CRAWL',
      type: 'S3',
      version: '1.0.0',
    },
    roleArn: roleArn,
  });

  res.status(201).json({ message: 'Application created', data: { application, index, retriever, dataSource } });
};

export default {
  create,
};
