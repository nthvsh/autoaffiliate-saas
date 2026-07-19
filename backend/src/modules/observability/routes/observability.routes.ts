import { Router } from 'express';
import {
  logMessage,
  getLogsController,
  clearLogsController,
  getSystemAlerts,
  triggerAlert,
  getSystemHealth,
} from '../controllers/observability.controller';

const router = Router();

router.post('/log', logMessage);
router.get('/logs', getLogsController);
router.delete('/logs', clearLogsController);
router.get('/alerts', getSystemAlerts);
router.post('/alerts', triggerAlert);
router.get('/health', getSystemHealth);

export default router;