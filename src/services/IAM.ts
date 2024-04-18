import {
  AttachRolePolicyCommand,
  AttachRolePolicyCommandInput,
  CreatePolicyCommand,
  CreatePolicyCommandInput,
  CreateRoleCommand,
  CreateRoleCommandInput,
  IAMClient,
} from '@aws-sdk/client-iam';
import {
  ACCESS_KEY_ID,
  AWS_ACCOUNT_ID,
  AWS_REGION,
  SECRET_ACCESS_KEY,
} from '../config/envs';

const client = new IAMClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export class IAM {
  static async createRole(createRoleCommandInput: CreateRoleCommandInput) {
    const command = new CreateRoleCommand(createRoleCommandInput);
    const response = await client.send(command);

    return response;
  }

  static async createPolicy(
    createPolicyCommandInput: CreatePolicyCommandInput
  ) {
    const command = new CreatePolicyCommand(createPolicyCommandInput);
    const response = await client.send(command);

    return response;
  }

  static async attachRolePolicy(
    attachRolePolicyCommandInput: AttachRolePolicyCommandInput
  ) {
    const command = new AttachRolePolicyCommand(attachRolePolicyCommandInput);
    const response = await client.send(command);

    return response;
  }

  static async createRoleDataSourceS3(applicationId: string, indexId: string) {
    // Create role
    const roleName = applicationId + '_role';
    const responseRole = await IAM.createRole({
      AssumeRolePolicyDocument: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'AllowsAmazonQToAssumeRoleForServicePrincipal',
            Effect: 'Allow',
            Principal: {
              Service: 'qbusiness.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': `${AWS_ACCOUNT_ID}`,
              },
              ArnLike: {
                'aws:SourceArn': `arn:aws:qbusiness:us-east-1:${AWS_ACCOUNT_ID}:application/${applicationId}`,
              },
            },
          },
        ],
      }),
      RoleName: roleName,
    });
    const roleArn = responseRole.Role?.Arn;

    // Create policy
    const policyName = applicationId + '_policy';
    const responsePolicy = await IAM.createPolicy({
      PolicyDocument: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'AllowsAmazonQToGetObjectfromS3',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${AWS_ACCOUNT_ID}-qbusiness-test/*`],
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:ResourceAccount': `${AWS_ACCOUNT_ID}`,
              },
            },
          },
          {
            Sid: 'AllowsAmazonQToListS3Buckets',
            Action: ['s3:ListBucket'],
            Resource: [`arn:aws:s3:::${AWS_ACCOUNT_ID}-qbusiness-test`],
            Effect: 'Allow',
            Condition: {
              StringEquals: {
                'aws:ResourceAccount': `${AWS_ACCOUNT_ID}`,
              },
            },
          },
          {
            Sid: 'AllowsAmazonQToIngestDocuments',
            Effect: 'Allow',
            Action: [
              'qbusiness:BatchPutDocument',
              'qbusiness:BatchDeleteDocument',
            ],
            Resource: `arn:aws:qbusiness:us-east-1:${AWS_ACCOUNT_ID}:application/${applicationId}/index/${indexId}`,
          },
          {
            Sid: 'AllowsAmazonQToCallPrincipalMappingAPIs',
            Effect: 'Allow',
            Action: [
              'qbusiness:PutGroup',
              'qbusiness:CreateUser',
              'qbusiness:DeleteGroup',
              'qbusiness:UpdateUser',
              'qbusiness:ListGroups',
            ],
            Resource: [
              `arn:aws:qbusiness:us-east-1:${AWS_ACCOUNT_ID}:application/${applicationId}`,
              `arn:aws:qbusiness:us-east-1:${AWS_ACCOUNT_ID}:application/${applicationId}/index/${indexId}`,
              `arn:aws:qbusiness:us-east-1:${AWS_ACCOUNT_ID}:application/${applicationId}/index/${indexId}/data-source/*`,
            ],
          },
        ],
      }),
      PolicyName: policyName,
    });
    const policyArn = responsePolicy.Policy?.Arn;

    // Attach policy to role
    await IAM.attachRolePolicy({
      PolicyArn: policyArn,
      RoleName: roleName,
    });

    // Wait for the role to be available
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return { roleArn, policyArn };
  }
}
