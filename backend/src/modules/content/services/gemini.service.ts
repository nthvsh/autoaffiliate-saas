import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ==================== REPLY GENERATION ====================

export const generateReply = async (pain: any, intent: any, niche: string) => {
  try {
    const prompt = `
You are an expert affiliate marketer in the ${niche} niche.
User pain: ${pain.primary_pain} (level: ${pain.pain_level})
User intent: ${intent.level} (score: ${intent.score})

Generate a personalized, helpful reply that:
1. Shows empathy for their pain
2. Provides value/education
3. Softly recommends a solution
4. Ends with a question to continue conversation

Keep it natural and conversational (150-200 words).
`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error: any) {
    console.error('❌ Groq error:', error.message);
    return null;
  }
};

// ==================== HOOK GENERATION ====================

export const generateHook = async (niche: string, topic: string) => {
  try {
    const prompt = `
Generate 5 viral hooks for a ${niche} post about "${topic}".
Each hook should be:
- Attention-grabbing
- Curious/emotional
- Under 10 words

Format: Just list hooks with numbers.
`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error: any) {
    console.error('❌ Hook error:', error.message);
    return null;
  }
};

// ==================== BLOG GENERATION ====================

export const generateBlogPost = async (niche: string, affiliateLink: string) => {
  try {
    // ✅ Use gemini-2.0-flash-exp (newer model)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
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
