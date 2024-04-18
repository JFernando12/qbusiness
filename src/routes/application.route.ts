import { Router } from 'express';
import applicationController from '../controllers/application.controller';

const router = Router();

router.post('/', applicationController.create);
router.get('/', applicationController.list);
router.get('/rfc/:rfc', applicationController.getByRfc);
router.post('/sync/rfc', applicationController.syncByRfc);
router.get('/:applicationId', applicationController.get);

export { router as applicationRouter }