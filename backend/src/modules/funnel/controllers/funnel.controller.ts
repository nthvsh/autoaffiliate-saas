import { Request, Response } from 'express';
import { startWhatsAppFunnel, processWhatsAppReply } from '../services/whatsapp.service';
import { startEmailSequence, processEmailReply } from '../services/email.service';

export const startWhatsApp = async (req: Request, res: Response) => {
  const { audienceId, phoneNumber } = req.body;
  if (!audienceId || !phoneNumber) {
    return res.status(400).json({ error: 'audienceId and phoneNumber are required' });
  }

  const result = await startWhatsAppFunnel(audienceId, phoneNumber);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ success: true, data: result.conversation });
};

export const processReply = async (req: Request, res: Response) => {
  const { conversationId, userMessage } = req.body;
  if (!conversationId || !userMessage) {
    return res.status(400).json({ error: 'conversationId and userMessage are required' });
  }

  const result = await processWhatsAppReply(conversationId, userMessage);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ success: true, reply: result.reply });
};

// ==================== EMAIL FUNCTIONS ====================

export const startEmail = async (req: Request, res: Response) => {
  const { audienceId, email } = req.body;
  if (!audienceId || !email) {
    return res.status(400).json({ error: 'audienceId and email are required' });
  }

  const result = await startEmailSequence(audienceId, email);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ success: true, data: result.sequence });
};

export const processEmail = async (req: Request, res: Response) => {
  const { sequenceId, userReply } = req.body;
  if (!sequenceId) {
    return res.status(400).json({ error: 'sequenceId is required' });
  }

  const result = await processEmailReply(sequenceId, userReply || '');
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ success: true, data: result });
};