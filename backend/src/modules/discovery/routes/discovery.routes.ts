import { Router } from 'express';
import { 
  searchRedditPosts, 
  getRedditSubredditPosts,
  searchYouTubeVideos,
  getYouTubeComments,
  searchGoogleWeb,
  searchBingWeb
} from '../controllers/discovery.controller';

const router = Router();

// Reddit routes
router.get('/reddit/search', searchRedditPosts);
router.get('/reddit/subreddit', getRedditSubredditPosts);

// YouTube routes
router.get('/youtube/search', searchYouTubeVideos);
router.get('/youtube/comments', getYouTubeComments);

// Google + Bing routes
router.get('/google/search', searchGoogleWeb);
router.get('/bing/search', searchBingWeb);

export default router;
