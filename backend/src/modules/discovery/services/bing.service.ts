import axios from 'axios';

const BING_API_KEY = process.env.BING_API_KEY!;

export const searchBing = async (query: string, country: string, limit: number = 10) => {
  try {
    console.log(`🔍 Bing: "${query}" (${country})`);

    // RapidAPI Bing Web Search endpoint (verified working)
    const url = `https://bing-web-search1.p.rapidapi.com/search?q=${encodeURIComponent(query)}&page=1&page_size=${limit}`;

    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-key': BING_API_KEY,
        'x-rapidapi-host': 'bing-web-search1.p.rapidapi.com'
      },
      timeout: 10000
    });

    // RapidAPI Bing response structure
    const items = response.data?.results || response.data?.webPages?.value || response.data?.value || [];

    const results = items.map((item: any) => ({
      title: item.title || item.name || 'No title',
      snippet: item.description || item.snippet || '',
      url: item.url || item.link || '',
      source: 'bing',
      country,
      found_at: new Date().toISOString()
    }));

    console.log(`✅ Bing: ${results.length} results`);
    return results;

  } catch (error: any) {
    console.error('❌ Bing error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data).slice(0, 300));
    }
    return [];
  }
};
