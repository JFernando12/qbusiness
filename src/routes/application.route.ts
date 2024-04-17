import { Router } from 'express';
import applicationController from '../controllers/application.controller';

const router = Router();

router.post('/', applicationController.create);

export { router as applicationRouter }