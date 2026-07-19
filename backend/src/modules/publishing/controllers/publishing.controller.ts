import { Request, Response } from 'express';
import { addToQueue, getQueueStatus } from '../services/queue.service';

export const addToPublishQueue = async (req: Request, res: Response) => {
  const { content, platform, scheduledTime, priority } = req.body;
  
  if (!content || !platform) {
    return res.status(400).json({ error: 'Content and platform are required' });
  }

  const item = addToQueue({
    content,
    platform,
    scheduledTime: scheduledTime ? new Date(scheduledTime) : new Date(),
    priority: priority || 'medium',
  });

  res.json({ success: true, item });
};

export const getQueueStatusController = async (req: Request, res: Response) => {
  const stats = getQueueStatus();
  res.json({ success: true, stats });
};