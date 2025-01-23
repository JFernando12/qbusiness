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
  ListApplicationsCommand,
  ListApplicationsCommandInput,
  GetApplicationCommand,
  GetApplicationCommandInput,
  GetIndexCommand,
  GetIndexCommandInput,
  ChatSyncCommand,
  ChatSyncCommandInput,
} from '@aws-sdk/client-qbusiness';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } from '../config/envs';

const client = new QBusinessClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
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

  static async listApplications(listApplicationsCommandInput: ListApplicationsCommandInput) {
    const command = new ListApplicationsCommand(listApplicationsCommandInput);
    const response = await client.send(command);

    return response;
  }

  static async getApplication(getApplicationCommandInput: GetApplicationCommandInput) {
    const command = new GetApplicationCommand(getApplicationCommandInput);
    const response = await client.send(command);

    return response;
  }

  static async getIndex(getIndexCommandInput: GetIndexCommandInput) {
    const command = new GetIndexCommand(getIndexCommandInput);
    const response = await client.send(command);

    return response;
  }

  static async chantSync(chanSyncCommandInput: ChatSyncCommandInput) {
    const command = new ChatSyncCommand(chanSyncCommandInput);
    const response = await client.send(command);

    return response;
  }
}
