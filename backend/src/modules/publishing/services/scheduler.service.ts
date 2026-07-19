import { addToQueue, getNextPending, markPublished } from './queue.service';

// Simulate publishing to platform
const publishToPlatform = async (item: any): Promise<boolean> => {
  console.log(`📤 Publishing to ${item.platform}: ${item.content.substring(0, 50)}...`);
  // In production: actual API call to platform
  // Simulate success/failure
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.random() > 0.2; // 80% success rate
};

// Process queue every minute
export const startScheduler = () => {
  console.log('⏰ Scheduler started - checking queue every 60s');
  
  setInterval(async () => {
    const next = getNextPending();
    if (!next) {
      console.log('📭 Queue empty');
      return;
    }
    
    console.log(`📋 Processing: ${next.id}`);
    next.status = 'processing';
    
    const success = await publishToPlatform(next);
    markPublished(next.id, success);
  }, 60000); // 60 seconds
};