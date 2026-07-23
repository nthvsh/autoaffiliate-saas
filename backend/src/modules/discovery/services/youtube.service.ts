import axios from 'axios';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

// ==================== YOUTUBE SEARCH (API) ====================

export const searchYouTube = async (query: string, maxResults: number = 10) => {
  try {
    console.log(`🔍 Searching YouTube for: ${query}`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${YOUTUBE_API_KEY}`;
    const response = await axios.get(url);
    const videos = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.default.url,
      url: `https://youtube.com/watch?v=${item.id.videoId}`,
    }));
    console.log(`✅ Found ${videos.length} videos`);
    return videos;
  } catch (error: any) {
    console.error('❌ YouTube search error:', error.message);
    return [];
  }
};

// ==================== YOUTUBE COMMENTS (API with Retry) ====================

export const getVideoComments = async (videoId: string, maxResults: number = 20, retries: number = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`💬 Fetching comments for video: ${videoId} (attempt ${i+1}/${retries})`);
      const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
      const response = await axios.get(url);
      
      const comments = response.data.items.map((item: any) => ({
        id: item.id,
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textDisplay,
        publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
        likeCount: item.snippet.topLevelComment.snippet.likeCount,
      }));
      
      console.log(`✅ Found ${comments.length} comments`);
      return comments;
    } catch (error: any) {
      console.error(`❌ Comments error (attempt ${i+1}/${retries}):`, error.message);
      if (error.response?.status === 403) {
        console.log(`⏳ Rate limit hit. Waiting ${Math.pow(2, i) * 5000}ms before retry...`);
      }
      if (i < retries - 1) {
        const waitTime = Math.pow(2, i) * 5000; // 5s, 10s, 20s
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error(`❌ Failed after ${retries} attempts for video ${videoId}`);
        return [];
      }
    }
  }
  return [];
};

// ==================== YOUTUBE COMMENTS (WEB SCRAPING - NO API KEY) ====================

export const scrapeYouTubeComments = async (videoId: string, limit: number = 20) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    console.log(`💬 Scraping comments for video: ${videoId}`);
    const page = await browser.newPage();
    await page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Scroll to load comments
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 500;
        const timer = setInterval(() => {
          const scrollHeight = document.documentElement.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight || totalHeight > 3000) {
            clearInterval(timer);
            resolve(undefined);
          }
        }, 500);
      });
    });

    // Extract comments
    const comments = await page.evaluate(() => {
      const items: any[] = [];
      const commentElements = document.querySelectorAll('#author-text, #content-text');
      
      for (let i = 0; i < commentElements.length; i += 2) {
        const author = commentElements[i]?.textContent?.trim() || 'Unknown';
        const text = commentElements[i+1]?.textContent?.trim() || '';
        if (text.length > 5) {
          items.push({
            author: author,
            text: text,
            publishedAt: new Date().toISOString(),
            likeCount: 0,
          });
        }
      }
      return items;
    });

    console.log(`✅ Scraped ${comments.length} comments`);
    return comments.slice(0, limit);

  } catch (error: any) {
    console.error('❌ Scraping error:', error.message);
    return [];
  } finally {
    await browser.close();
  }
};
