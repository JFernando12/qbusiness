import { Request, Response } from 'express';
import { QBusiness } from '../services/QBusiness';
import { IAM } from '../services/IAM';
import { AWS_ACCOUNT_ID } from '../config/envs';
import { DynamoDB } from '../services/DynamoDB';

const create = async (req: Request, res: Response) => {
  const rfc = req.body.rfc;
  const description = req.body.description;

  // Check if the rfc already exists
  const item = await DynamoDB.getItem({
    TableName: 'qbusiness-applications',
    Key: {
      rfc: { S: rfc },
    },
  });

  if (item.Item) {
    return res.status(400).json({ message: 'Application already exists' });
  }

  // Create an application
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
  const { roleArn } = await IAM.createRoleDataSourceS3(
    applicationId!,
    indexId!
  );

  // Save rfc and applicationId in a DynamoDB table
  await DynamoDB.putItem({
    TableName: 'qbusiness-applications',
    Item: {
      rfc: { S: rfc },
      applicationId: { S: applicationId! },
      indexId: { S: indexId! },
      retrieverId: { S: retriever.retrieverId! },
      roles: {
        L: [
          {
            M: {
              type: { S: 'DATA_SOURCE_S3' },
              roleArn: { S: roleArn! },
            },
          },
        ],
      },
    },
  });

  res.status(201).json({
    message: 'Application created',
    data: { application, index, retriever },
  });
};

const list = async (req: Request, res: Response) => {
  const applications = await QBusiness.listApplications({});
  res.status(200).json({ data: applications });
};

const get = async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId;
  const application = await QBusiness.getApplication({ applicationId });
  res.status(200).json({ data: application });
};

const getByRfc = async (req: Request, res: Response) => {
  const rfc = req.params.rfc;

  const item = await DynamoDB.getItem({
    TableName: 'qbusiness-applications',
    Key: {
      rfc: { S: rfc },
    },
  });

  if (!item.Item) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const applicationId = item.Item.applicationId.S;
  const application = await QBusiness.getApplication({ applicationId });

  res.status(200).json({ data: application });
};

const syncByRfc = async (req: Request, res: Response) => {
  const rfc = req.body.rfc;
  const dataSourceId = req.body.dataSourceId;

  const item = await DynamoDB.getItem({
    TableName: 'qbusiness-applications',
    Key: {
      rfc: { S: rfc },
    },
  });

  if (!item.Item) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const applicationId = item.Item.applicationId.S;
  const indexId = item.Item.indexId.S;

  const index = await QBusiness.getIndex({ applicationId, indexId });
  const indexStatus = index.status;

  if (indexStatus != 'ACTIVE') {
    return res.status(400).json({ message: 'Index is not active' });
  }

  if (!dataSourceId) {
    return res.status(404).json({ message: 'Data source not found' });
  }

  const dataSource = await QBusiness.syncDataSource({
    applicationId,
    indexId,
    dataSourceId,
  });

  res.status(200).json({ data: dataSource });
};

const createDataSource = async (req: Request, res: Response) => {
  const rfc = req.params.rfc;
  const dataSource = req.body.dataSource;

  const item = await DynamoDB.getItem({
    TableName: 'qbusiness-applications',
    Key: {
      rfc: { S: rfc },
    },
  });

  if (!item.Item) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const applicationId = item.Item.applicationId.S;
  const indexId = item.Item.indexId.S;

  const roleArn = item.Item.roles.L?.find(
    (role: any) => role.M.type.S === 'DATA_SOURCE_S3'
  )?.M?.roleArn.S;

  if (!roleArn) {
    return res.status(404).json({ message: 'Role not found' });
  }

  const dataSourceResponse = await QBusiness.createDataSource({
    applicationId,
    indexId,
    displayName: `${applicationId}_${dataSource.displayName}`,
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
    roleArn,
  });

  res.status(201).json({ data: dataSourceResponse });
};

export default {
  create,
  list,
  get,
  getByRfc,
  syncByRfc,
  createDataSource,
};
