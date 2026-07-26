import dotenv from 'dotenv';
dotenv.config();

class GoogleKeyManager {
  private keys: string[] = [];
  private index = 0;

  constructor() {
    for (let i = 1; i <= 10; i++) {
      const key = process.env[`GOOGLE_API_KEY_${i}`];
      if (key) this.keys.push(key);
    }
    if (process.env.GOOGLE_API_KEY && !this.keys.includes(process.env.GOOGLE_API_KEY)) {
      this.keys.unshift(process.env.GOOGLE_API_KEY);
    }
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
