import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://autoaffiliate-saas-1.onrender.com';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  niche: string;
  published_at: string;
}

// ✅ Robust parser — handles "json prefix, markdown, plain JSON
const parseExcerpt = (excerpt: string): string => {
  if (!excerpt) return 'No excerpt available';
  
  let cleanStr = excerpt.trim();
  
  // Remove "json prefix (if present)
  if (cleanStr.startsWith('"json')) {
    cleanStr = cleanStr.substring(5).trim(); // Remove "json
  }
  
  // Remove markdown code blocks
  const codeBlockMatch = cleanStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    cleanStr = codeBlockMatch[1].trim();
  }
  
  // Try to parse as JSON
  if (cleanStr.startsWith('{')) {
    try {
      const parsed = JSON.parse(cleanStr);
      if (parsed.content) return parsed.content.substring(0, 200);
      if (parsed.excerpt) return parsed.excerpt.substring(0, 200);
      if (typeof parsed === 'string') return parsed.substring(0, 200);
      return cleanStr.substring(0, 200);
    } catch (e) {
      console.log('Failed to parse JSON, using as is');
    }
  }
  
  return cleanStr.substring(0, 200);
};

// ✅ Helper: Clean title
const parseTitle = (title: string): string => {
  if (!title) return 'Blog Post';
  
  let cleanStr = title.trim();
  
  // Remove "json prefix
  if (cleanStr.startsWith('"json')) {
    cleanStr = cleanStr.substring(5).trim();
  }
  
  // Remove markdown code blocks
  const codeBlockMatch = cleanStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    cleanStr = codeBlockMatch[1].trim();
  }
  
  // Try to parse as JSON
  if (cleanStr.startsWith('{')) {
    try {
      const parsed = JSON.parse(cleanStr);
      return parsed.title || cleanStr;
    } catch (e) {
      // Not JSON, use as is
    }
  }
  
  return cleanStr;
};

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blog/posts`);
        setPosts(res.data.data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
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
        posts.map((post) => (
          <div key={post.id} style={{ marginBottom: 30, borderBottom: '1px solid #eee', paddingBottom: 20 }}>
            <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: '#1a3a6b' }}>
              <h2>{parseTitle(post.title)}</h2>
            </Link>
            <p style={{ color: '#666' }}>{parseExcerpt(post.excerpt)}...</p>
            <small>Niche: {post.niche} | {new Date(post.published_at).toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
};
