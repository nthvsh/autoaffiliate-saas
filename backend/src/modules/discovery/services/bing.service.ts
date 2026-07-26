import axios from 'axios';

const BING_API_KEY = process.env.BING_API_KEY!;

export const searchBing = async (query: string, country: string, limit: number = 10) => {
  try {
    console.log(`🔍 Bing: "${query}" | Key exists: ${!!BING_API_KEY}`);

    // Try RapidAPI Bing endpoint
    const url = `https://bing-web-search1.p.rapidapi.com/search?q=${encodeURIComponent(query)}&page=1&page_size=${limit}`;

    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-key': BING_API_KEY,
        'x-rapidapi-host': 'bing-web-search1.p.rapidapi.com'
      },
      timeout: 15000
    });

    console.log('📊 Bing Status:', response.status);
    console.log('📊 Bing Keys:', Object.keys(response.data || {}));

    const items = response.data?.results || [];
    
    const results = items.map((item: any) => ({
      title: item.title || 'No title',
      snippet: item.description || item.snippet || '',
      url: item.url || item.link || '',
      source: 'bing',
      country,
      found_at: new Date().toISOString()
    }));

    console.log(`✅ Bing: ${results.length} results`);
    return results;

  } catch (error: any) {
    console.error('❌ Bing ERROR:', error.message);
    console.error('❌ Status:', error.response?.status);
    console.error('❌ Response:', JSON.stringify(error.response?.data || {}).slice(0, 500));
    return [];
  }
};
