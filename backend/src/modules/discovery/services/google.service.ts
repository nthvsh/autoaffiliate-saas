import axios from 'axios';
import { googleKeyManager } from '../../../config/google-keys';
import { supabase } from '../../../config/database';

const GOOGLE_CX = process.env.GOOGLE_CX;

export const searchGoogle = async (query: string, country: string, limit: number = 10) => {
  // DEBUG: Check if GOOGLE_CX exists
  if (!GOOGLE_CX) {
    console.error('🚨 GOOGLE_CX is MISSING from environment variables!');
    return [];
  }

  const key = googleKeyManager.getNextKey();
  if (!key) {
    console.error('❌ No Google API keys');
    return [];
  }

  try {
    console.log(`🔍 Google: "${query}"`);
    console.log(`🔍 Using CX: ${GOOGLE_CX.slice(0, 8)}... | Key: ****${key.slice(-8)}`);
    
    const gl = country === 'US' ? 'us' : country === 'UK' ? 'uk' : 'in';
    const url = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}&gl=${gl}&num=${limit}`;
    
    const response = await axios.get(url, { timeout: 10000 });
    
    const results = response.data.items?.map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      url: item.link,
      source: 'google',
      country,
      found_at: new Date().toISOString()
    })) || [];
    
    console.log(`✅ Google: ${results.length} results`);
    return results;
  } catch (error: any) {
    console.error('❌ Google error:', error.response?.status, error.message);
    // Log the actual URL that failed (mask the key)
    const failedUrl = error.config?.url?.replace(/key=[^&]+/, 'key=****');
    console.error('❌ Failed URL:', failedUrl);
    return [];
  }
};
