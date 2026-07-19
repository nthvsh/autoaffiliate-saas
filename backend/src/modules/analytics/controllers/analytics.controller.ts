import { Request, Response } from 'express';
import { getCampaignStats, getFunnelAnalytics, getContentPerformance } from '../services/analytics.service';

export const getDashboard = async (req: Request, res: Response) => {
  const campaignId = req.params.campaignId as string;
  if (!campaignId) {
    return res.status(400).json({ error: 'campaignId is required' });
  }

  const stats = await getCampaignStats(campaignId);
  const funnel = await getFunnelAnalytics(campaignId);
  const content = await getContentPerformance(campaignId);

  res.json({
    success: true,
    data: {
      stats,
      funnel,
      topContent: content,
    },
  });
};

export const getCampaignStatsController = async (req: Request, res: Response) => {
  const campaignId = req.params.campaignId as string;
  const stats = await getCampaignStats(campaignId);
  res.json({ success: true, data: stats });
};