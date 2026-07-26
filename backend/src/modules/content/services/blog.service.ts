import { supabase } from '../../../config/database';

export const generateAndSaveBlogPost = async (campaignId: string, niche: string, affiliateLink: string) => {
  try {
    // Generate blog post using Groq AI
    const blogData = await generateBlogPost(niche, affiliateLink);
    
    // Create slug
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    // Save to database
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        campaign_id: campaignId,
        title: blogData.title,
        slug: slug,
        content: blogData.content,
        excerpt: blogData.excerpt || blogData.content.substring(0, 200),
        niche: niche,
        affiliate_link: affiliateLink || '',
        category: blogData.category || 'General',
        tags: blogData.tags || [],
        published_at: new Date().toISOString(),
      }])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error('❌ Blog post error:', error.message);
    return { success: false, error: error.message };
  }
};

export const getBlogPosts = async (limit: number = 10, offset: number = 0) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  return { data, error };
};

export const getBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  return { data, error };
};

// Generate blog post using Groq AI
export const generateBlogPost = async (niche: string, affiliateLink: string) => {
  // This will use Groq to generate a 600-800 word SEO blog post
  // Implementation in next step
};
