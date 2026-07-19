import { Router } from 'express';
import { startWhatsApp, processReply, startEmail, processEmail } from '../controllers/funnel.controller';

const router = Router();

// WhatsApp routes
router.post('/whatsapp/start', startWhatsApp);
router.post('/whatsapp/reply', processReply);

// Email routes
router.post('/email/start', startEmail);
router.post('/email/reply', processEmail);

export default router;