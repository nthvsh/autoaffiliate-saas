import axios from 'axios';

export const searchBing = async (query: string, country: string, limit: number = 10) => {
  try {
    console.log(`🔍 DuckDuckGo: "${query}"`);

    const url = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    });

    const html = response.data;

    // Parse results from HTML using regex
    const results: any[] = [];
    const resultBlocks = html.match(/<tr>[\s\S]*?<\/tr>/g) || [];

    for (const block of resultBlocks.slice(0, limit)) {
      const titleMatch = block.match(/<a[^>]*class="[^"]*result-link[^"]*"[^>]*>([^<]*)<\/a>/);
      const urlMatch = block.match(/<a[^>]*class="[^"]*result-link[^"]*"[^>]*href="([^"]*)"/);
      const snippetMatch = block.match(/<td[^>]*class="[^"]*result-snippet[^"]*"[^>]*>([\s\S]*?)<\/td>/);

      if (titleMatch && urlMatch) {
        results.push({
          title: titleMatch[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim(),
          snippet: snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim() : '',
          url: urlMatch[1].startsWith('http') ? urlMatch[1] : `https:${urlMatch[1]}`,
          source: 'duckduckgo',
          country,
          found_at: new Date().toISOString(),
        });
      }
    }

    console.log(`✅ DuckDuckGo: ${results.length} results`);
    return results;

  } catch (error: any) {
    console.error('❌ DuckDuckGo error:', error.message);
    return [];
  }
};
