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

// ✅ Ultimate parser — handles all JSON-like formats
const parseExcerpt = (excerpt: string): string => {
  if (!excerpt) return 'No excerpt available';
  
  let cleanStr = excerpt.trim();
  
  // 1. Remove "json prefix (with quotes)
  if (cleanStr.startsWith('"json')) {
    cleanStr = cleanStr.substring(5).trim();
  }
  
  // 2. Remove json prefix (without quotes) — NEW
  if (cleanStr.startsWith('json')) {
    cleanStr = cleanStr.substring(4).trim();
  }
  
  // 3. Remove markdown code blocks
  const codeBlockMatch = cleanStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    cleanStr = codeBlockMatch[1].trim();
  }
  
  // 4. Try to parse as full JSON
  if (cleanStr.startsWith('{')) {
    try {
      const parsed = JSON.parse(cleanStr);
      let extracted = parsed.content || parsed.excerpt || parsed;
      if (typeof extracted === 'string') {
        return extracted.substring(0, 200);
      }
      return cleanStr.substring(0, 200);
    } catch (e) {
      // If JSON parse fails, try regex to extract content
      const contentMatch = cleanStr.match(/"content":\s*"([^"]*)"/);
      if (contentMatch && contentMatch[1]) {
        let text = contentMatch[1].replace(/\\"/g, '"').trim();
        return text.substring(0, 200);
      }
    }
  }
  
  // 5. Try to find "content": pattern even without braces
  const contentMatch = cleanStr.match(/"content":\s*"([^"]*)"/);
  if (contentMatch && contentMatch[1]) {
    let text = contentMatch[1].replace(/\\"/g, '"').trim();
    return text.substring(0, 200);
  }
  
  // 6. Try to find "excerpt": pattern
  const excerptMatch = cleanStr.match(/"excerpt":\s*"([^"]*)"/);
  if (excerptMatch && excerptMatch[1]) {
    let text = excerptMatch[1].replace(/\\"/g, '"').trim();
    return text.substring(0, 200);
  }
  
  // 7. Fallback: remove JSON artifacts
  let fallback = cleanStr
    .replace(/^["{]/g, '')
    .replace(/["}]$/g, '')
    .replace(/\\"/g, '"')
    .trim();
  
  return fallback.substring(0, 200) || 'No excerpt available';
};

// ✅ Helper: Clean title
const parseTitle = (title: string): string => {
  if (!title) return 'Blog Post';
  
  let cleanStr = title.trim();
  
  // Remove "json prefix
  if (cleanStr.startsWith('"json')) {
    cleanStr = cleanStr.substring(5).trim();
  }
  
  // Remove json prefix (without quotes)
  if (cleanStr.startsWith('json')) {
    cleanStr = cleanStr.substring(4).trim();
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
      return parsed.title || 'Blog Post';
    } catch (e) {
      // Try to extract title with regex
      const titleMatch = cleanStr.match(/"title":\s*"([^"]*)"/);
      if (titleMatch && titleMatch[1]) {
        return titleMatch[1];
      }
    }
  }
  
  // If it's a JSON-like string with "title":, extract it
  const titleMatch = cleanStr.match(/"title":\s*"([^"]*)"/);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1];
  }
  
  // Remove any remaining JSON artifacts
  return cleanStr.replace(/^["{]/g, '').replace(/["}]$/g, '').trim() || 'Blog Post';
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
