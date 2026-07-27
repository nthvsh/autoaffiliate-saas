import Groq from 'groq-sdk';
// ✅ Fixed import path (3 levels up to src/config)
import { getGeminiModel } from '../../../config/gemini';
import { getGroqClient } from '../../../config/groq';  // ✅ NEW: Import Groq client
import dotenv from 'dotenv';

dotenv.config();

// ✅ Initialize Groq (for replies & hooks)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
  // Try Groq first
  try {
    console.log('📝 Trying Groq for blog generation...');
    const groqClient = getGroqClient();
    
    const prompt = `
Write a detailed, SEO-optimized blog post about ${niche}.
Target audience: People interested in ${niche} solutions.
Include: Introduction, 3-4 main points, conclusion.
Add a natural call-to-action with this affiliate link: ${affiliateLink || '#'}
Length: 600-800 words.
Return as JSON with fields: title, content, excerpt, category, tags.
`;

    const response = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || '';
    console.log('✅ Groq blog generated successfully!');
    return parseBlogResponse(content, niche);
    
  } catch (groqError: any) {
    // If Groq fails, fallback to Gemini
    console.log(`❌ Groq failed: ${groqError.message}`);
    console.log('🔄 Falling back to Gemini...');
    
    try {
      const model = getGeminiModel('gemini-2.0-flash');
      
      const prompt = `
Write a detailed, SEO-optimized blog post about ${niche}.
Target audience: People interested in ${niche} solutions.
Include: Introduction, 3-4 main points, conclusion.
Add a natural call-to-action with this affiliate link: ${affiliateLink || '#'}
Length: 600-800 words.
Return as JSON with fields: title, content, excerpt, category, tags.
`;

      const result = await model.generateContent(prompt);
      const content = result.response.text();
      console.log('✅ Gemini blog generated successfully!');
      return parseBlogResponse(content, niche);
      
    } catch (geminiError: any) {
      console.error(`❌ Gemini also failed: ${geminiError.message}`);
      throw new Error(`Both Groq and Gemini failed. Groq: ${groqError.message}, Gemini: ${geminiError.message}`);
    }
  }
};

// Helper function to parse blog response
const parseBlogResponse = (content: string, niche: string) => {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || `${niche} - Complete Guide`,
        content: parsed.content || content,
        excerpt: parsed.excerpt || content.substring(0, 200),
        category: parsed.category || 'General',
        tags: parsed.tags || [niche],
      };
    }
  } catch (e) {
    console.log('JSON parse failed, using fallback');
  }
  
  return {
    title: `${niche} - Complete Guide`,
    content: content,
    excerpt: content.substring(0, 200),
    category: 'General',
    tags: [niche],
  };
};
