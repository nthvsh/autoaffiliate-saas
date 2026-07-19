import { Router } from 'express';
import { generateReplyFromText, generateHookFromTopic } from '../controllers/content.controller';

const router = Router();
router.post('/generate-reply', generateReplyFromText);
router.post('/generate-hook', generateHookFromTopic);

export default router;