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

export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blog/posts/${slug}`);
        setPost(res.data.data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}>Loading...</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: 50 }}>Post not found</div>;

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 20, fontFamily: 'Arial' }}>
      <Link to="/blog" style={{ textDecoration: 'none', color: '#1a3a6b' }}>← Back to Blog</Link>
      <h1>{post.title}</h1>
      <small>Published: {new Date(post.published_at).toLocaleDateString()}</small>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <hr />
      <div style={{ background: '#f0f4fb', padding: 20, borderRadius: 10, textAlign: 'center' }}>
        <p>Learn more about {post.niche}:</p>
        <a href={post.affiliate_link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '15px 30px', background: '#f15a2c', color: '#fff', textDecoration: 'none', borderRadius: 5, fontSize: '18px' }}>
          🔥 Check This Out
        </a>
      </div>
    </div>
  );
};
