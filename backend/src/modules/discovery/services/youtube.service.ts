import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

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

export const getVideoComments = async (videoId: string, maxResults: number = 20) => {
  try {
    console.log(`💬 Fetching comments for video: ${videoId}`);
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
    console.error('❌ Comments error:', error.message);
    return [];
  }
};