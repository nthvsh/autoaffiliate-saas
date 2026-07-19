// Detect pain points from text
export const detectPainPoints = (text: string) => {
  const painKeywords = {
    urgent: ['emergency', 'immediate', 'urgent', 'asap', 'quick'],
    emotional: ['frustrated', 'anxious', 'scared', 'worried', 'depressed'],
    financial: ['expensive', 'cost', 'budget', 'cheap', 'afford'],
    health: ['pain', 'symptom', 'treatment', 'disease', 'doctor'],
    social: ['embarrassed', 'ashamed', 'judged', 'alone'],
  };

  let scores = { urgent: 0, emotional: 0, financial: 0, health: 0, social: 0 };
  let total = 0;

  const lowerText = text.toLowerCase();
  for (const [category, keywords] of Object.entries(painKeywords)) {
    let count = 0;
    for (const word of keywords) {
      if (lowerText.includes(word)) count++;
    }
    scores[category as keyof typeof scores] = count;
    total += count;
  }

  const overallPain = Math.min((total / 5) * 2, 10);
  const maxCategory = Object.keys(scores).reduce((a, b) => scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b);
  const painLevel = overallPain > 7 ? 'high' : overallPain > 4 ? 'medium' : 'low';

  return {
    ...scores,
    overall_pain: parseFloat(overallPain.toFixed(1)),
    pain_level: painLevel,
    primary_pain: maxCategory,
  };
};