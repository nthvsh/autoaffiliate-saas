import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/database';
import authRoutes from './modules/saas/routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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
        name: productName || 'Campaign',  // ✅ Yeh line add karein
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

// ✅ Error handling in listen
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server error:', err);
});