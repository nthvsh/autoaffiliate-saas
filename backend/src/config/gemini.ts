import { GoogleGenerativeAI } from '@google/generative-ai';

// Load all Gemini keys from environment
const geminiKeys = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
].filter((key): key is string => key !== undefined && key !== '');

console.log(`🔑 Loaded ${geminiKeys.length} Gemini keys`);

// Create clients for each key
const geminiClients = geminiKeys.map(key => new GoogleGenerativeAI(key));

// Round-robin counter
let currentKeyIndex = 0;

export const getGeminiClient = () => {
  const client = geminiClients[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % geminiClients.length;
  return client;
};

export const getGeminiModel = (modelName: string = 'gemini-2.0-flash') => {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: modelName });
};
