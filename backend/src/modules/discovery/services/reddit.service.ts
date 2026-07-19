import axios from 'axios';

export const searchReddit = async (query: string, limit: number = 10) => {
  try {
    console.log(`🔍 Searching Reddit for: ${query}`);
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AutoAffiliateBot/1.0)' },
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
    console.log(`✅ Found ${posts.length} posts`);
    return posts;
  } catch (error: any) {
    console.error('❌ Reddit search error:', error.message);
    return [];
  }
};

export const getSubredditPosts = async (subreddit: string, limit: number = 10) => {
  try {
    console.log(`🔍 Fetching r/${subreddit} posts`);
    const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AutoAffiliateBot/1.0)' },
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