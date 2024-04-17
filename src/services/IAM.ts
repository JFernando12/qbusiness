import { AttachRolePolicyCommand, AttachRolePolicyCommandInput, CreatePolicyCommand, CreatePolicyCommandInput, CreateRoleCommand, CreateRoleCommandInput, IAMClient } from "@aws-sdk/client-iam";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from "../config/envs";

const client = new IAMClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export class IAM {
  static async createRole(createRoleCommandInput: CreateRoleCommandInput) {
    const command = new CreateRoleCommand(createRoleCommandInput);
  
    const response = await client.send(command);
    console.log('response: ', response);

    return response;
  }

  static async createPolicy(createPolicyCommandInput: CreatePolicyCommandInput) {
    const command = new CreatePolicyCommand(createPolicyCommandInput);
  
    const response = await client.send(command);
    console.log('response: ', response);

    return response;
  }

  static async attachRolePolicy(attachRolePolicyCommandInput: AttachRolePolicyCommandInput) {
    const command = new AttachRolePolicyCommand(attachRolePolicyCommandInput);
  
    const response = await client.send(command);
    console.log('response: ', response);

    return response;
  }
}