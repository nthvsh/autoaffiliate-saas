export const scoreIntent = (text: string) => {
  const buyerKeywords = ['buy', 'purchase', 'best', 'recommend', 'review', 'price', 'affordable', 'cost', 'cheap', 'expensive'];
  const researcherKeywords = ['how to', 'what is', 'why', 'difference', 'vs', 'guide', 'step', 'tutorial', 'learn'];
  const curiousKeywords = ['just', 'maybe', 'i think', 'curious', 'wondering', 'interesting', 'seems'];

  let score = 0;
  const lowerText = text.toLowerCase();

  for (const word of buyerKeywords) {
    if (lowerText.includes(word)) score += 6;
  }
  for (const word of researcherKeywords) {
    if (lowerText.includes(word)) score += 3;
  }
  for (const word of curiousKeywords) {
    if (lowerText.includes(word)) score += 1;
  }

  score = Math.min(score, 100);
  const level = score >= 75 ? 'Buyer Ready' : score >= 50 ? 'Warm Lead' : score >= 25 ? 'Researcher' : 'Curious';

  return { score, level };
};
