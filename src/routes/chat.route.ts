import { Router } from 'express';
import chatController from '../controllers/chat.controller';

const router = Router();

router.post('/', chatController.send);

export { router as chatRouter }