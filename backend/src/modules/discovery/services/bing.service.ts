import axios from 'axios';

const BING_API_KEY = process.env.BING_API_KEY!;

export const searchBing = async (query: string, country: string, limit: number = 10) => {
  try {
    console.log(`🔍 Searching Bing for: ${query} (${country})`);
    const market = country === 'US' ? 'en-us' : country === 'UK' ? 'en-gb' : 'en-in';
    const url = `https://bing-web-search1.p.rapidapi.com/search?q=${encodeURIComponent(query)}&count=${limit}&mkt=${market}`;
    const response = await axios.get(url, {
      headers: {
        'X-RapidAPI-Key': BING_API_KEY,
        'X-RapidAPI-Host': 'bing-web-search1.p.rapidapi.com'
      }
    });
    
    const results = response.data.webPages?.value?.map((item: any) => ({
      title: item.name,
      snippet: item.snippet,
      url: item.url,
      source: 'bing',
      country: country,
      found_at: new Date().toISOString()
    })) || [];
    
    console.log(`✅ Bing found ${results.length} results`);
    return results;
  } catch (error: any) {
    console.error('❌ Bing search error:', error.message);
    return [];
  }
};
