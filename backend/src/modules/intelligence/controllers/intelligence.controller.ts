import { Request, Response } from 'express';
import { detectPainPoints } from '../services/pain.service';
import { scoreIntent } from '../services/intent.service';

export const analyzeText = async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  const pain = detectPainPoints(text);
  const intent = scoreIntent(text);

  res.json({
    success: true,
    pain,
    intent,
  });
};