import { Request, Response } from 'express';
import { getBlogPosts, getBlogPostBySlug } from '../services/blog.service';

export const getBlogPostsController = async (req: Request, res: Response) => {
  const limit = req.query.limit as string;
  const offset = req.query.offset as string;
  const result = await getBlogPosts(Number(limit) || 10, Number(offset) || 0);
  if (result.error) {
    return res.status(500).json({ error: result.error.message });
  }
  res.json({ success: true, data: result.data });
};

export const getBlogPostBySlugController = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;  // ✅ Type assertion
  const result = await getBlogPostBySlug(slug);
  if (result.error) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  res.json({ success: true, data: result.data });
};
