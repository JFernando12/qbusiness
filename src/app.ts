import express from 'express';
import { applicationRouter } from './routes/application.route';
import { chatRouter } from './routes/chat.route';

const app = express();

app.use(express.json());
app.use('/applications', applicationRouter);
app.use('/chat', chatRouter);

export { app };