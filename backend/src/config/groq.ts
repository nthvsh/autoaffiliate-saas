import Groq from 'groq-sdk';

// Load all Groq keys from environment
const groqKeys = [
  process.env.GROQ_API_KEY,
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
].filter((key): key is string => key !== undefined && key !== '');

console.log(`🔑 Loaded ${groqKeys.length} Groq keys`);

// Create clients for each key
const groqClients = groqKeys.map(key => new Groq({ apiKey: key }));

// Round-robin counter
let currentKeyIndex = 0;

export const getGroqClient = () => {
  const client = groqClients[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % groqClients.length;
  return client;
};
