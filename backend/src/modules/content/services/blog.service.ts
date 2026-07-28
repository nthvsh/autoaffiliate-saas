import { createClient } from '@supabase/supabase-js';
import { generateBlogPost } from './gemini.service';

// ✅ Admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const generateAndSaveBlogPost = async (campaignId: string, niche: string, affiliateLink: string) => {
  try {
    console.log(`📝 Generating blog post for campaign: ${campaignId}`);
    const blogData = await generateBlogPost(niche, affiliateLink);
    
    // ✅ FIX: Add timestamp to make slug unique
    const timestamp = Date.now();
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-') + '-' + timestamp;

    // ✅ Using admin client to bypass RLS
    const { data, error } = await supabaseAdmin
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
    console.log(`✅ Blog post saved: ${blogData.title}`);
    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error('❌ Blog post error:', error.message);
    return { success: false, error: error.message };
  }
};

export const getBlogPosts = async (limit: number = 10, offset: number = 0) => {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  return { data, error };
};

export const getBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  return { data, error };
};
