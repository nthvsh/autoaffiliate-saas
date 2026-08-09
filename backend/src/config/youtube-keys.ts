import dotenv from 'dotenv';
dotenv.config();

class YouTubeKeyManager {
  private keys: string[] = [];
  private index = 0;

  constructor() {
    // ✅ Dynamically load all keys from environment
    // Supports: YOUTUBE_API_KEY, YOUTUBE_API_KEY_1 to YOUTUBE_API_KEY_10
    for (let i = 1; i <= 10; i++) {
      const key = process.env[`YOUTUBE_API_KEY_${i}`];
      if (key) this.keys.push(key);
    }
    // ✅ Also check plain YOUTUBE_API_KEY
    if (process.env.YOUTUBE_API_KEY && !this.keys.includes(process.env.YOUTUBE_API_KEY)) {
      this.keys.unshift(process.env.YOUTUBE_API_KEY);
    }
    
    // ✅ Remove duplicates
    this.keys = [...new Set(this.keys)];
    
    console.log(`🔑 Loaded ${this.keys.length} YouTube keys`);
  }

  getNextKey(): string | null {
    if (this.keys.length === 0) {
      console.warn('⚠️ No YouTube API keys available!');
      return null;
    }
    const key = this.keys[this.index];
    this.index = (this.index + 1) % this.keys.length;
    return key;
  }

  // ✅ Get all keys (for debugging)
  getAllKeys(): string[] {
    return this.keys;
  }

  // ✅ Get key count (for debugging)
  getKeyCount(): number {
    return this.keys.length;
  }
}

export const youtubeKeyManager = new YouTubeKeyManager();
