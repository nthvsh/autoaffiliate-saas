import { Router } from 'express';
import { getBlogPostsController, getBlogPostBySlugController } from '../controllers/blog.controller';

const router = Router();

router.get('/posts', getBlogPostsController);
router.get('/posts/:slug', getBlogPostBySlugController);

export default router;
