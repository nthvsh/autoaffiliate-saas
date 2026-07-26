import axios from 'axios';
import { googleKeyManager } from '../../../config/google-keys';
import { supabase } from '../../../config/database';

const GOOGLE_CX = process.env.GOOGLE_CX!;

export const searchGoogle = async (query: string, country: string, limit: number = 10) => {
  // Cache check
  const { data: cached } = await supabase
    .from('youtube_cache')
    .select('*')
    .eq('cache_type', 'google_search')
    .eq('query', query)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (cached) {
    console.log('💾 Google cache hit:', query);
    return cached.data;
  }

  const key = googleKeyManager.getNextKey();
  if (!key) {
    console.error('❌ No Google API keys');
    return [];
  }

  try {
    console.log(`🔍 Google: "${query}" | Key: ****${key.slice(-8)}`);
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

    // Save cache (24 hours)
    await supabase.from('youtube_cache').upsert({
      cache_type: 'google_search',
      query,
      data: results,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: 'cache_type,query' });

    return results;
  } catch (error: any) {
    console.error('❌ Google error:', error.response?.status, error.message);
    return [];
  }
};
