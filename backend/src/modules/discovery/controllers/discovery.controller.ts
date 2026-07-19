import { Request, Response } from 'express';
import { searchReddit, getSubredditPosts } from '../services/reddit.service';
import { searchYouTube, getVideoComments } from '../services/youtube.service';

// ==================== REDDIT ====================
export const searchRedditPosts = async (req: Request, res: Response) => {
  const { query, limit } = req.query;
  const results = await searchReddit(query as string, Number(limit) || 10);
  res.json({ success: true, count: results.length, data: results });
};

export const getRedditSubredditPosts = async (req: Request, res: Response) => {
  const { subreddit, limit } = req.query;
  const results = await getSubredditPosts(subreddit as string, Number(limit) || 10);
  res.json({ success: true, count: results.length, data: results });
};

// ==================== YOUTUBE ====================
export const searchYouTubeVideos = async (req: Request, res: Response) => {
  const { query, limit } = req.query;
  const results = await searchYouTube(query as string, Number(limit) || 10);
  res.json({ success: true, count: results.length, data: results });
};

export const getYouTubeComments = async (req: Request, res: Response) => {
  const { videoId, limit } = req.query;
  const results = await getVideoComments(videoId as string, Number(limit) || 20);
  res.json({ success: true, count: results.length, data: results });
};