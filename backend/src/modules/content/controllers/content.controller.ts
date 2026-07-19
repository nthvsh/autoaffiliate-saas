import { Request, Response } from 'express';
import { generateReply, generateHook } from '../services/gemini.service';
import { detectPainPoints } from '../../intelligence/services/pain.service';
import { scoreIntent } from '../../intelligence/services/intent.service';

export const generateReplyFromText = async (req: Request, res: Response) => {
  const { text, niche } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  const pain = detectPainPoints(text);
  const intent = scoreIntent(text);
  const reply = await generateReply(pain, intent, niche || 'general');

  res.json({ success: true, pain, intent, reply });
};

export const generateHookFromTopic = async (req: Request, res: Response) => {
  const { niche, topic } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  const hooks = await generateHook(niche || 'general', topic);
  res.json({ success: true, hooks });
};