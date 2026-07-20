import axios from 'axios';

const BING_API_KEY = process.env.BING_API_KEY!;

export const searchBing = async (query: string, country: string, limit: number = 10) => {
  try {
    console.log(`🔍 Searching Bing for: ${query} (${country})`);
    const market = country === 'US' ? 'en-US' : country === 'UK' ? 'en-GB' : 'en-IN';
    const url = `https://bing-web-search1.p.rapidapi.com/search?q=${encodeURIComponent(query)}&count=${limit}&mkt=${market}`;
    
    console.log('📤 Bing URL:', url);
    console.log('🔑 Bing Key:', BING_API_KEY ? '✅ Set' : '❌ Missing');
    
    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-key': BING_API_KEY,
        'x-rapidapi-host': 'bing-web-search1.p.rapidapi.com'
      }
    });
    
    console.log('📥 Bing Response:', response.status);
    console.log('📊 Data keys:', Object.keys(response.data));
    
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
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return [];
  }
};
