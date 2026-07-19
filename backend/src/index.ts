import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/database';
import authRoutes from './modules/saas/routes/auth.routes';
import campaignRoutes from './modules/campaign/routes/campaign.routes';
import complianceRoutes from './modules/compliance/routes/compliance.routes';
import discoveryRoutes from './modules/discovery/routes/discovery.routes';
import intelligenceRoutes from './modules/intelligence/routes/intelligence.routes';
import contentRoutes from './modules/content/routes/content.routes';
import publishingRoutes from './modules/publishing/routes/publishing.routes';
import promptRoutes from './modules/prompts/routes/prompt.routes';
import funnelRoutes from './modules/funnel/routes/funnel.routes';
import analyticsRoutes from './modules/analytics/routes/analytics.routes';
import observabilityRoutes from './modules/observability/routes/observability.routes';
import { startScheduler } from './modules/publishing/services/scheduler.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Updated CORS - Allow Vercel frontend
app.use(cors({
  origin: ['https://autoaffiliate-saas.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// ✅ Test Route - Check if server is working
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Server Working' });
});

app.get('/', (req, res) => {
  res.json({ message: 'AutoAffiliate SaaS Backend Running' });
});

app.get('/api/test-db', async (req, res) => {
  const { data, error } = await supabase.from('users').select('count');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ success: true, data });
});

// ✅ Campaign Route - Direct (No import)
app.post('/api/campaign/run', async (req, res) => {
  console.log('✅ Campaign route HIT!');
  console.log('Body:', req.body);
  
  try {
    const { country, niche, category, productName, affiliateLink, landingPage } = req.body;

    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        name: productName || 'Campaign',
        country,
        niche,
        category,
        product_name: productName,
        affiliate_link: affiliateLink,
        landing_page_url: landingPage,
        status: 'running',
        started_at: new Date().toISOString(),
      }])
      .select();

    if (error) throw error;

    res.json({ success: true, campaignId: data[0].id, message: 'Campaign started!' });
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/publishing', publishingRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/funnel', funnelRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/observability', observabilityRoutes);

// ✅ Error handling in listen
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // Start scheduler after server starts
  startScheduler();
}).on('error', (err) => {
  console.error('❌ Server error:', err);
});
