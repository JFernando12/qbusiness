import {
  CreateTableCommand,
  CreateTableCommandInput,
  DeleteTableCommand,
  DeleteTableCommandInput,
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb';
import { ACCESS_KEY_ID, AWS_REGION, SECRET_ACCESS_KEY } from '../config/envs';

const client = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export class DynamoDB {
  static async createTable(createTableCommandInput: CreateTableCommandInput) {
    const command = new CreateTableCommand(createTableCommandInput);
    const response = await client.send(command);
    return response;
  }
  static async putItem(putItemCommandInput: PutItemCommandInput) {
    const command = new PutItemCommand(putItemCommandInput);
    const response = await client.send(command);
    return response;
  }
  static async getItem(getItemCommandInput: GetItemCommandInput) {
    const command = new GetItemCommand(getItemCommandInput);
    const response = await client.send(command);
    return response;
  }
  static async scan(scanCommandInput: ScanCommandInput) {
    const command = new ScanCommand(scanCommandInput);
    const response = await client.send(command);
    return response;
  }
  static async query(queryCommandInput: QueryCommandInput) {
    const command = new QueryCommand(queryCommandInput);
    const response = await client.send(command);
    return response;
  }
  static async deleteTable(deleteTableCommandInput: DeleteTableCommandInput) {
    const command = new DeleteTableCommand(deleteTableCommandInput);
    const response = await client.send(command);
    return response;
  }
}
