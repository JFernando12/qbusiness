import express from 'express';
import { applicationRouter } from './routes/application.route';

const app = express();

app.use(express.json());
app.use(applicationRouter);

export { app };