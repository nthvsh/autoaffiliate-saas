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
import { searchYouTube, scrapeYouTubeComments } from './modules/discovery/services/youtube.service'; // ✅ Changed
import { addToQueue } from './modules/publishing/services/queue.service';
import { detectPainPoints } from './modules/intelligence/services/pain.service';
import { scoreIntent } from './modules/intelligence/services/intent.service';
import { generateReply } from './modules/content/services/gemini.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow all origins (for testing)
app.use(cors({
  origin: '*',
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

// ✅ Campaign Route - With Web Scraping (No API Limit!)
app.post('/api/campaign/run', async (req, res) => {
  console.log('✅ Campaign route HIT!');
  console.log('Body:', req.body);
  
  try {
    const { country, niche, category, productName, affiliateLink, landingPage } = req.body;

    // 1. Save campaign
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

    const campaignId = data[0].id;
    console.log(`✅ Campaign saved: ${campaignId}`);

    // 2. 🔥 START DISCOVERY WITH WEB SCRAPING (NO API LIMIT!)
    console.log(`🔍 Starting discovery for campaign: ${campaignId}`);
    
    (async () => {
      try {
        console.log(`📺 Searching YouTube for: ${niche}`);
        const videos = await searchYouTube(niche, 5);
        
        let totalComments = 0;
        let qualifiedComments = 0;
        
        for (const video of videos) {
          console.log(`💬 Scraping comments for video: ${video.id}`);
          // ✅ Using web scraping — no API key, no rate limit!
          const comments = await scrapeYouTubeComments(video.id, 20);
          
          for (const comment of comments) {
            totalComments++;
            
            const pain = detectPainPoints(comment.text);
            const intent = scoreIntent(comment.text);
            
            // ✅ Log every comment's score for debugging
            console.log(`📊 Comment ${totalComments}: Intent=${intent.score}, Pain=${pain.pain_level}, Text: ${comment.text.substring(0, 40)}...`);
            
            // ✅ TEMPORARY: Lowered threshold for testing (intent > 0 means ALL comments)
            if (intent.score > 0) {
              qualifiedComments++;
              console.log(`🎯 Qualified comment found! Intent=${intent.score}, Pain=${pain.pain_level}`);
              
              await supabase.from('audience').insert([{
                campaign_id: campaignId,
                username: comment.author,
                platform: 'youtube',
                country: country,
                post_content: comment.text,
                pain_score: pain.overall_pain,
                pain_category: pain.primary_pain,
                intent_score: intent.score,
                intent_level: intent.level,
                found_at: new Date().toISOString()
              }]);
              
              const aiReply = await generateReply(pain, intent, niche);
              const replyWithLink = `${aiReply}\n\n👉 Check this out: ${landingPage}?campaign=${campaignId}&country=${country}`;
              
              addToQueue({
                content: replyWithLink,
                platform: 'youtube',
                scheduledTime: new Date(),
                priority: intent.score > 75 ? 'high' : 'medium'
              });
            }
          }
        }
        
        console.log(`✅ Discovery complete! Found ${qualifiedComments} qualified comments out of ${totalComments} total`);
      } catch (err) {
        console.error('❌ Background discovery error:', err);
      }
    })();

    // 3. Return response immediately
    res.json({ 
      success: true, 
      campaignId: campaignId, 
      message: 'Campaign started! Discovery running in background.' 
    });
    
  } catch (error: any) {
    console.error('❌ Error:', error);
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
