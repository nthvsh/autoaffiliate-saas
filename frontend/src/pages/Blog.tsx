import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://autoaffiliate-saas-1.onrender.com';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  niche: string;
  published_at: string;
}

// ✅ Helper: Clean excerpt from JSON or plain text
const cleanExcerpt = (excerpt: string, content?: string): string => {
  try {
    // Try to parse as JSON
    const parsed = JSON.parse(excerpt);
    if (parsed.excerpt) {
      return parsed.excerpt.substring(0, 200);
    }
    if (parsed.content) {
      return parsed.content.substring(0, 200);
    }
    return excerpt.substring(0, 200);
  } catch {
    // Not JSON, use as is
    if (excerpt && excerpt.length > 0) {
      return excerpt.substring(0, 200);
    }
    // Fallback to content
    if (content) {
      try {
        const parsedContent = JSON.parse(content);
        return parsedContent.content?.substring(0, 200) || content.substring(0, 200);
      } catch {
        return content.substring(0, 200);
      }
    }
    return 'No excerpt available';
  }
};

// ✅ Helper: Extract title from content if needed
const getDisplayTitle = (title: string, content?: string): string => {
  if (title && title !== 'null' && title !== 'undefined') {
    return title;
  }
  try {
    if (content) {
      const parsed = JSON.parse(content);
      return parsed.title || 'Blog Post';
    }
  } catch {
    // ignore
  }
  return 'Blog Post';
};

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blog/posts`);
        console.log('📝 Blog posts fetched:', res.data.data);
        setPosts(res.data.data || []);
      } catch (error) {
        console.error('❌ Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}>Loading posts...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>📝 Blog</h1>
      {posts.length === 0 ? (
        <p>No blog posts yet. Run a campaign to generate one!</p>
      ) : (
        posts.map((post) => {
          const displayTitle = getDisplayTitle(post.title, post.content);
          const displayExcerpt = cleanExcerpt(post.excerpt, post.content);
          
          return (
            <div key={post.id} style={{ marginBottom: 30, borderBottom: '1px solid #eee', paddingBottom: 20 }}>
              <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: '#1a3a6b' }}>
                <h2>{displayTitle}</h2>
              </Link>
              <p style={{ color: '#666' }}>{displayExcerpt}...</p>
              <small>Niche: {post.niche} | {new Date(post.published_at).toLocaleDateString()}</small>
            </div>
          );
        })
      )}
    </div>
  );
};
