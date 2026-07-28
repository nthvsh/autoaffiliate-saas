import { createClient } from '@supabase/supabase-js';
import { generateBlogPost } from './gemini.service';

// ✅ Admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ Helper: Ensure we extract clean fields (no JSON wrapper)
const extractBlogData = (rawData: any, niche: string) => {
  let title = rawData.title || `${niche} - Complete Guide`;
  let content = rawData.content || '';
  let excerpt = rawData.excerpt || '';
  let category = rawData.category || 'General';
  let tags = rawData.tags || [niche];

  // If content looks like JSON, parse it
  if (typeof content === 'string' && (content.trim().startsWith('{') || content.trim().startsWith('```json'))) {
    try {
      // Remove markdown code blocks if present
      let jsonStr = content;
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
      }
      const parsed = JSON.parse(jsonStr);
      content = parsed.content || content;
      title = parsed.title || title;
      excerpt = parsed.excerpt || excerpt;
      category = parsed.category || category;
      tags = parsed.tags || tags;
    } catch (e) {
      console.log('⚠️ Failed to parse content JSON, using as is');
    }
  }

  // If title looks like JSON, parse it
  if (typeof title === 'string' && (title.trim().startsWith('{') || title.trim().startsWith('```json'))) {
    try {
      let jsonStr = title;
      const codeBlockMatch = title.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
      }
      const parsed = JSON.parse(jsonStr);
      title = parsed.title || title;
    } catch (e) {
      console.log('⚠️ Failed to parse title JSON, using as is');
    }
  }

  // If excerpt empty, generate from content
  if (!excerpt) {
    excerpt = content.substring(0, 200);
  }

  return { title, content, excerpt, category, tags };
};

export const generateAndSaveBlogPost = async (campaignId: string, niche: string, affiliateLink: string) => {
  try {
    console.log(`📝 Generating blog post for campaign: ${campaignId}`);
    const rawBlogData = await generateBlogPost(niche, affiliateLink);
    
    // ✅ Extract clean fields
    const { title, content, excerpt, category, tags } = extractBlogData(rawBlogData, niche);

    // ✅ Generate unique slug from clean title
    const timestamp = Date.now();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-') + '-' + timestamp;

    // ✅ Using admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([{
        campaign_id: campaignId,
        title: title,
        slug: slug,
        content: content,
        excerpt: excerpt,
        niche: niche,
        affiliate_link: affiliateLink || '',
        category: category,
        tags: tags,
        published_at: new Date().toISOString(),
      }])
      .select();

    if (error) throw error;
    console.log(`✅ Blog post saved: ${title}`);
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
