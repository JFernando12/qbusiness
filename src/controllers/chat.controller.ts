import { Request, Response } from 'express';
import { QBusiness } from '../services/QBusiness';
import { DynamoDB } from '../services/DynamoDB';

const send = async (req: Request, res: Response) => {
  const rfc = req.body.rfc;
  const message = req.body.message;

  // Check if the rfc already exists
  const item = await DynamoDB.getItem({
    TableName: 'qbusiness-applications',
    Key: {
      rfc: { S: rfc },
    },
  });

  if (!item.Item) {
    return res.status(400).json({ message: 'Application does not exist' });
  }

  const applicationId = item.Item.applicationId.S;

  const response = await QBusiness.chantSync({
    applicationId,
    userId: 'chat-service',
    userMessage: message,
  })

  res.status(201).json({ message: 'Message sent', data: response });
}

export default {
  send,
};
