import axios from 'axios';

const BING_API_KEY = process.env.BING_API_KEY!;

export const searchBing = async (query: string, country: string, limit: number = 10) => {
  try {
    console.log(`🔍 Searching Bing for: ${query} (${country})`);
    const market = country === 'US' ? 'en-US' : country === 'UK' ? 'en-GB' : 'en-IN';
    const url = `https://bing-web-search4.p.rapidapi.com/search?q=${encodeURIComponent(query)}&count=${limit}&mkt=${market}`;
    
    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-key': BING_API_KEY,
        'x-rapidapi-host': 'bing-web-search4.p.rapidapi.com'
      }
    });
    
    // Debug: Log full response structure
    console.log('📥 Response Status:', response.status);
    console.log('📊 Full Response:', JSON.stringify(response.data, null, 2).slice(0, 500));
    
    // Try different data paths
    const webPages = response.data?.webPages?.value || [];
    const results = webPages.map((item: any) => ({
      title: item.name || item.title || 'No title',
      snippet: item.snippet || item.description || '',
      url: item.url || item.link || '',
      source: 'bing',
      country: country,
      found_at: new Date().toISOString()
    }));
    
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
