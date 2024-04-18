import {
  QBusinessClient,
  CreateApplicationCommand,
  CreateApplicationCommandInput,
  CreateIndexCommand,
  CreateIndexCommandInput,
  CreateRetrieverCommand,
  CreateRetrieverCommandInput,
  CreateDataSourceCommand,
  CreateDataSourceCommandInput,
  StartDataSourceSyncJobCommand,
  StartDataSourceSyncJobCommandInput,
} from '@aws-sdk/client-qbusiness';
import { ACCESS_KEY_ID, AWS_REGION, SECRET_ACCESS_KEY } from '../config/envs';

const client = new QBusinessClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export class QBusiness {
  static async createApplication(createApplicationCommandInput: CreateApplicationCommandInput) {
    const command = new CreateApplicationCommand(createApplicationCommandInput);
    const response = await client.send(command);

    return response;
  }

  static async createIndex(createIndexCommandInput: CreateIndexCommandInput) {
    const command = new CreateIndexCommand(createIndexCommandInput);
    const response = await client.send(command);
    
    return response;
  }

  static async createRetriever(createRetrieverCommandInput: CreateRetrieverCommandInput) {
    const command = new CreateRetrieverCommand(createRetrieverCommandInput);
    const response = await client.send(command);

    return response;
  }

  static async createDataSource(createDataSourceCommandInput: CreateDataSourceCommandInput) {
    const command = new CreateDataSourceCommand(createDataSourceCommandInput);
    const response = await client.send(command);
    
    return response;
  }

  static async syncDataSource(startDataSourceSyncJobCommandInput: StartDataSourceSyncJobCommandInput) {
    const command = new StartDataSourceSyncJobCommand(startDataSourceSyncJobCommandInput);
    const response = await client.send(command);

    return response;
  }
}
