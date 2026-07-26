import axios from 'axios';

const MEDIUM_TOKEN = process.env.MEDIUM_API_TOKEN;

export const publishToMedium = async (title: string, content: string, tags: string[]) => {
  try {
    // Get user ID
    const userRes = await axios.get('https://api.medium.com/v1/me', {
      headers: { Authorization: `Bearer ${MEDIUM_TOKEN}` },
    });
    const userId = userRes.data.data.id;

    // Publish post
    const postRes = await axios.post(
      `https://api.medium.com/v1/users/${userId}/posts`,
      {
        title,
        contentFormat: 'markdown',
        content,
        tags: tags.slice(0, 5),
        publishStatus: 'public',
      },
      {
        headers: {
          Authorization: `Bearer ${MEDIUM_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Medium published:', postRes.data.data.url);
    return postRes.data.data.url;
  } catch (error: any) {
    console.error('❌ Medium error:', error.response?.data || error.message);
    return null;
  }
};
