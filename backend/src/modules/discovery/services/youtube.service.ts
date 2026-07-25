import axios from 'axios';
import { youtubeKeyManager } from '../../../config/youtube-keys';
import { supabase } from '../../../config/database';

const BASE = 'https://www.googleapis.com/youtube/v3';

// ==================== YOUTUBE SEARCH ====================
export const searchYouTube = async (query: string, maxResults = 5) => {
  // Cache check
  const { data: cached } = await supabase
    .from('youtube_cache')
    .select('*')
    .eq('cache_type', 'search')
    .eq('query', query)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (cached) {
    console.log('💾 Cache hit:', query);
    return cached.data;
  }

  const key = youtubeKeyManager.getNextKey();
  if (!key) throw new Error('No YouTube keys available');

  try {
    console.log(`🔍 Searching: "${query}" | Key: ****${key.slice(-8)}`);
    const url = `${BASE}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${key}`;
    const res = await axios.get(url, { timeout: 10000 });

    const videos = res.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.default?.url || '',
      url: `https://youtube.com/watch?v=${item.id.videoId}`,
    }));

    console.log(`✅ Found ${videos.length} videos`);

    // Save cache (12 hours)
    await supabase.from('youtube_cache').upsert({
      cache_type: 'search',
      query,
      data: videos,
      expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: 'cache_type,query' });

    return videos;
  } catch (error: any) {
    console.error('❌ Search error:', error.message);
    return [];
  }
};

// ==================== YOUTUBE COMMENTS ====================
export const getVideoComments = async (videoId: string, maxResults = 10, retries = 3) => {
  // Cache check
  const { data: cached } = await supabase
    .from('youtube_cache')
    .select('*')
    .eq('cache_type', 'comments')
    .eq('video_id', videoId)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (cached) {
    console.log('💾 Cache hit comments:', videoId);
    return cached.data;
  }

  for (let i = 0; i < retries; i++) {
    const key = youtubeKeyManager.getNextKey();
    if (!key) {
      console.error('❌ No keys available');
      return [];
    }

    try {
      console.log(`💬 Comments: ${videoId} | Key: ****${key.slice(-8)} | Attempt ${i+1}/${retries}`);
      const url = `${BASE}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&key=${key}`;
      const res = await axios.get(url, { timeout: 10000 });

      const comments = res.data.items.map((item: any) => ({
        id: item.id,
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textDisplay,
        publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
        likeCount: item.snippet.topLevelComment.snippet.likeCount,
      }));

      console.log(`✅ Found ${comments.length} comments`);

      // Save cache (48 hours)
      await supabase.from('youtube_cache').upsert({
        cache_type: 'comments',
        video_id: videoId,
        data: comments,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'cache_type,video_id' });

      return comments;
    } catch (error: any) {
      console.error(`❌ Comments error (attempt ${i+1}):`, error.message);
      if (i < retries - 1) {
        const wait = Math.pow(2, i) * 3000;
        console.log(`⏳ Waiting ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }
  return [];
};
