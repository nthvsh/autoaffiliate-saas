import { Router } from 'express';
import { getDashboard, getCampaignStatsController } from '../controllers/analytics.controller';
import { trackView, getViews } from '../controllers/tracking.controller';

const router = Router();

router.get('/dashboard/:campaignId', getDashboard);
router.get('/campaign/:campaignId', getCampaignStatsController);

// New tracking routes
router.post('/track/view', trackView);
router.get('/views/:campaignId', getViews);

export default router;
