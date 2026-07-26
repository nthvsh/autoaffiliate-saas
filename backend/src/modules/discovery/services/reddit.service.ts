import axios from 'axios';

export const searchReddit = async (query: string, limit: number = 10) => {
  try {
    console.log(`🔍 Reddit: "${query}"`);
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&t=month&limit=${limit}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.reddit.com/',
      },
      timeout: 15000,
    });

    const posts = response.data?.data?.children || [];
    
    const results = posts.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      subreddit: child.data.subreddit,
      author: child.data.author,
      score: child.data.score,
      num_comments: child.data.num_comments,
      url: `https://reddit.com${child.data.permalink}`,
      content: child.data.selftext || child.data.title,
      source: 'reddit',
      found_at: new Date().toISOString(),
    }));

    console.log(`✅ Reddit: ${results.length} results`);
    return results;
  } catch (error: any) {
    console.error('❌ Reddit error:', error.response?.status, error.message);
    return [];
  }
};

export const getSubredditPosts = async (subreddit: string, limit: number = 10) => {
  try {
    console.log(`🔍 Fetching r/${subreddit} posts`);
    const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.reddit.com/',
      },
      timeout: 15000,
    });
    const posts = response.data.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      subreddit: child.data.subreddit,
      author: child.data.author,
      score: child.data.score,
      num_comments: child.data.num_comments,
      url: `https://reddit.com${child.data.permalink}`,
      content: child.data.selftext || child.data.title,
    }));
    console.log(`✅ Found ${posts.length} posts from r/${subreddit}`);
    return posts;
  } catch (error: any) {
    console.error(`❌ Subreddit ${subreddit} error:`, error.message);
    return [];
  }
};
