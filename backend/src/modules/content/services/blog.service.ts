export const generateBlogPost = async (niche: string, affiliateLink: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
Write a detailed, SEO-optimized blog post about ${niche}.
Target audience: People interested in ${niche} solutions.
Include: Introduction, 3-4 main points, conclusion.
Add a natural call-to-action with this affiliate link: ${affiliateLink || '#'}
Length: 600-800 words.
Return as JSON with fields: title, content, excerpt, category, tags.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          title: parsed.title || `${niche} - Complete Guide`,
          content: parsed.content || response,
          excerpt: parsed.excerpt || response.substring(0, 200),
          category: parsed.category || 'General',
          tags: parsed.tags || [niche],
        };
      }
    } catch (e) {
      console.log('JSON parse failed, using fallback');
    }
    
    // Fallback
    return {
      title: `${niche} - Complete Guide`,
      content: response,
      excerpt: response.substring(0, 200),
      category: 'General',
      tags: [niche],
    };
  } catch (error: any) {
    console.error('❌ Blog generation error:', error.message);
    throw error;
  }
};
