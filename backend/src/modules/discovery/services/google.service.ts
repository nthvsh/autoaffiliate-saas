import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
const GOOGLE_CX = process.env.GOOGLE_CX!;

export const searchGoogle = async (query: string, country: string, limit: number = 10) => {
  try {
    console.log(`🔍 Searching Google for: ${query} (${country})`);
    const gl = country === 'US' ? 'us' : country === 'UK' ? 'uk' : 'in';
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}&gl=${gl}&num=${limit}`;
    const response = await axios.get(url);
    
    const results = response.data.items?.map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      url: item.link,
      source: 'google',
      country: country,
      found_at: new Date().toISOString()
    })) || [];
    
    console.log(`✅ Google found ${results.length} results`);
    return results;
  } catch (error: any) {
    console.error('❌ Google search error:', error.message);
    return [];
  }
};
