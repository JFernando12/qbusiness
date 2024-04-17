import { config } from 'dotenv';

config();

export const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID as string;
export const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY as string;
export const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID as string;