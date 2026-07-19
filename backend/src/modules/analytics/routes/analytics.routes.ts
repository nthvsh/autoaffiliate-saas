import { Router } from 'express';
import { getDashboard, getCampaignStatsController } from '../controllers/analytics.controller';

const router = Router();

router.get('/dashboard/:campaignId', getDashboard);
router.get('/campaign/:campaignId', getCampaignStatsController);

export default router;