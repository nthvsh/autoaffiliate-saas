import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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