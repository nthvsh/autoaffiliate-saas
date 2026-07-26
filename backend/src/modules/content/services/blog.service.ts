import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateBlogPost = async (niche: string, productName: string, affiliateLink: string) => {
  const prompt = `
Write a helpful, SEO-friendly blog post about "${niche}".
Naturally mention "${productName}" as a solution.
Include a call-to-action linking to: ${affiliateLink}
Word count: 600-800 words.
Format: Title, Introduction, 3-4 Sections, Conclusion with CTA.
Tone: Friendly, expert, trustworthy.
`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || '';
  const title = content.split('\n')[0].replace('#', '').trim();

  return { title, content };
};
