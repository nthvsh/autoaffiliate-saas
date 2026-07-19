import { Router } from 'express';
import { 
  searchRedditPosts, 
  getRedditSubredditPosts,
  searchYouTubeVideos,
  getYouTubeComments
} from '../controllers/discovery.controller';

const router = Router();

// Reddit routes
router.get('/reddit/search', searchRedditPosts);
router.get('/reddit/subreddit', getRedditSubredditPosts);

// YouTube routes
router.get('/youtube/search', searchYouTubeVideos);
router.get('/youtube/comments', getYouTubeComments);

export default router;