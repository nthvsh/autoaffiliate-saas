import { Router } from 'express';
import { getRiskScore, checkShadowban, getHumanizationScore } from '../controllers/compliance.controller';

const router = Router();

router.get('/risk/:workspaceId/:platform', getRiskScore);
router.get('/shadowban/:workspaceId/:platform', checkShadowban);
router.get('/humanization/:workspaceId', getHumanizationScore);

export default router;