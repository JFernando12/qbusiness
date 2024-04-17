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
} from '@aws-sdk/client-qbusiness';
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from '../config/envs';

const client = new QBusinessClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export class QBusiness {
  static async createApplication(createApplicationCommandInput: CreateApplicationCommandInput) {
    console.log('createApplicationCommandInput: ', createApplicationCommandInput);
    const command = new CreateApplicationCommand(createApplicationCommandInput);

    const response = await client.send(command);
    console.log('response: ', response);

    return response;
  }

  static async createIndex(createIndexCommandInput: CreateIndexCommandInput) {
    const command = new CreateIndexCommand(createIndexCommandInput);
    const response = await client.send(command);
    console.log('response: ', response);
    
    return response;
  }

  static async createRetriever(createRetrieverCommandInput: CreateRetrieverCommandInput) {
    const command = new CreateRetrieverCommand(createRetrieverCommandInput);
    const response = await client.send(command);
    console.log('response: ', response);

    return response;
  }

  static async createDataSource(createDataSourceCommandInput: CreateDataSourceCommandInput) {
    const command = new CreateDataSourceCommand(createDataSourceCommandInput);
    const response = await client.send(command);
    console.log('response: ', response);
    
    return response;
  }
}
