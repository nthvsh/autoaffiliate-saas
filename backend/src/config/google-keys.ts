import dotenv from 'dotenv';
dotenv.config();

class GoogleKeyManager {
  private keys: string[] = [];
  private index = 0;

  constructor() {
    // ✅ GOOGLE_API_KEY, GOOGLE_API_KEY_1, GOOGLE_API_KEY_2 dhoondega
    const keys = [
      process.env.GOOGLE_API_KEY,
      process.env.GOOGLE_API_KEY_1,
      process.env.GOOGLE_API_KEY_2,
    ].filter((key): key is string => key !== undefined && key !== '');

    this.keys = keys;
    console.log(`🔑 Loaded ${this.keys.length} Google keys`);
  }

  getNextKey(): string | null {
    if (this.keys.length === 0) return null;
    const key = this.keys[this.index];
    this.index = (this.index + 1) % this.keys.length;
    return key;
  }
}

export const googleKeyManager = new GoogleKeyManager();
