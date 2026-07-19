import { Router } from 'express';
import { addToPublishQueue, getQueueStatusController } from '../controllers/publishing.controller';

const router = Router();

router.post('/queue/add', addToPublishQueue);
router.get('/queue/status', getQueueStatusController);

export default router;