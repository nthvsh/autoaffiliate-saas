import axios from 'axios';

export const searchBing = async (query: string, country: string, limit: number = 10) => {
  try {
    console.log(`🔍 DuckDuckGo: "${query}"`);

    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    });

    const html = response.data;

    // Simple regex to extract results
    const results: any[] = [];
    
    // DuckDuckGo HTML result pattern
    const linkRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
    const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
    
    const links: Array<{url: string, title: string}> = [];
    let match;
    
    while ((match = linkRegex.exec(html)) !== null && links.length < limit) {
      let url = match[1];
      // DuckDuckGo redirects through their domain
      if (url.startsWith('//duckduckgo.com/l/?')) {
        const uddg = url.match(/uddg=([^&]*)/);
        if (uddg) {
          url = decodeURIComponent(uddg[1]);
        }
      }
      const title = match[2].replace(/<[^>]*>/g, '').trim();
      links.push({ url, title });
    }

    const snippets: string[] = [];
    while ((match = snippetRegex.exec(html)) !== null && snippets.length < limit) {
      snippets.push(match[1].replace(/<[^>]*>/g, '').trim());
    }

    for (let i = 0; i < links.length; i++) {
      results.push({
        title: links[i].title,
        snippet: snippets[i] || '',
        url: links[i].url,
        source: 'duckduckgo',
        country,
        found_at: new Date().toISOString(),
      });
    }

    console.log(`✅ DuckDuckGo: ${results.length} results`);
    return results;

  } catch (error: any) {
    console.error('❌ DuckDuckGo error:', error.message);
    return [];
  }
};
