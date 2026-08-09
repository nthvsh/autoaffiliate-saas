import cron from 'node-cron';
import { generateAndSaveBlogPost } from './src/modules/content/services/blog.service';

const BLOG_SCHEDULE = '0 9 * * *';
const DEFAULT_AFFILIATE_LINK = 'https://6d59adfrlnb44r3ltkt12qvk7t.hop.clickbank.net/?&tid=wellsofthub';

const NICHE_CONFIGS = [
  { niche: 'Dental Health', country: 'United States' },
  { niche: 'Weight Loss', country: 'United States' },
  { niche: 'Skincare', country: 'United States' },
  { niche: 'Hair Loss', country: 'United States' },
  { niche: 'Joint Pain', country: 'United States' },
];

export const startBlogScheduler = () => {
  console.log('📝 Blog scheduler started - running daily at 9 AM');
  
  cron.schedule(BLOG_SCHEDULE, async () => {
    console.log(`🕘 Running scheduled blog generation at ${new Date().toISOString()}`);
    
    for (const config of NICHE_CONFIGS) {
      try {
        const campaignId = `scheduled-${Date.now()}-${config.niche.replace(/\s/g, '-')}`;
        console.log(`📝 Generating blog for niche: ${config.niche}`);
        
        const result = await generateAndSaveBlogPost(
          campaignId,
          config.niche,
          DEFAULT_AFFILIATE_LINK
        );
        
        if (result.success) {
          console.log(`✅ Blog generated for ${config.niche}: ${result.data.title}`);
        } else {
          console.error(`❌ Failed for ${config.niche}: ${result.error}`);
        }
      } catch (error) {
        console.error(`❌ Error generating blog for ${config.niche}:`, error);
      }
    }
    
    console.log('✅ Daily blog generation complete');
  });
};
