import { Router } from 'express';
import { runCampaign } from '../controllers/campaign.controller';

console.log('✅ Campaign routes file loaded');

const router = Router();

// Test route to check if router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Campaign route working!' });
});

router.post('/run', runCampaign);

export default router;