import { Request, Response } from 'express';
import { trackPageView, getPageViews } from '../services/tracking.service';

export const trackView = async (req: Request, res: Response) => {
  const { campaignId, country } = req.body;
  if (!campaignId || !country) {
    return res.status(400).json({ error: 'campaignId and country required' });
  }
  
  const result = await trackPageView(campaignId, country);
  if (result.error) return res.status(500).json({ error: result.error.message });
  res.json({ success: true });
};

export const getViews = async (req: Request, res: Response) => {
  const { campaignId } = req.params;
  const result = await getPageViews(campaignId);
  if (result.error) return res.status(500).json({ error: result.error.message });
  res.json({ success: true, data: result.data });
};
