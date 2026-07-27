import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://autoaffiliate-saas-1.onrender.com';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  niche: string;
  affiliate_link: string;
  published_at: string;
}

// ✅ Helper: Parse content from JSON or plain text
const parseContent = (content: string): { title: string; body: string; excerpt: string } => {
  try {
    // Try to parse as JSON
    const parsed = JSON.parse(content);
    return {
      title: parsed.title || 'Blog Post',
      body: parsed.content || content,
      excerpt: parsed.excerpt || content.substring(0, 200),
    };
  } catch {
    // Not JSON, use as is
    return {
      title: 'Blog Post',
      body: content,
      excerpt: content.substring(0, 200),
    };
  }
};

// ✅ Helper: Convert plain text to HTML paragraphs
const textToHtml = (text: string): string => {
  if (!text) return '';
  // Split by double newlines for paragraphs
  const paragraphs = text.split(/\n\n+/);
  return paragraphs
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
};

export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log(`📝 Fetching blog post: ${slug}`);
        const res = await axios.get(`${API_URL}/api/blog/posts/${slug}`);
        console.log('✅ Blog post fetched:', res.data.data);
        setPost(res.data.data);
      } catch (error) {
        console.error('❌ Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}>Loading...</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: 50 }}>Post not found</div>;

  const { title, body, excerpt } = parseContent(post.content);
  const displayTitle = post.title && post.title !== 'null' && post.title !== 'undefined' 
    ? post.title 
    : title;

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 20, fontFamily: 'Arial' }}>
      <Link to="/blog" style={{ textDecoration: 'none', color: '#1a3a6b' }}>← Back to Blog</Link>
      <h1>{displayTitle}</h1>
      <small>Published: {new Date(post.published_at).toLocaleDateString()}</small>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: textToHtml(body) }} />
      <hr />
      <div style={{ background: '#f0f4fb', padding: 20, borderRadius: 10, textAlign: 'center' }}>
        <p>Learn more about {post.niche}:</p>
        <a 
          href={post.affiliate_link} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            display: 'inline-block', 
            padding: '15px 30px', 
            background: '#f15a2c', 
            color: '#fff', 
            textDecoration: 'none', 
            borderRadius: 5, 
            fontSize: '18px' 
          }}
        >
          🔥 Check This Out
        </a>
      </div>
    </div>
  );
};
