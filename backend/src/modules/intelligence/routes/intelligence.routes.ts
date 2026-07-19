import { Router } from 'express';
import { analyzeText } from '../controllers/intelligence.controller';

const router = Router();
router.post('/analyze', analyzeText);

export default router;