// Queue Service - Manage publishing queue
export interface QueueItem {
  id: string;
  content: string;
  platform: string;
  scheduledTime: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'published' | 'failed';
  retryCount: number;
}

// In-memory queue (production: use Redis/BullMQ)
const queue: QueueItem[] = [];
const MAX_RETRIES = 3;

export const addToQueue = (item: Omit<QueueItem, 'id' | 'status' | 'retryCount'>) => {
  const newItem: QueueItem = {
    ...item,
    id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    status: 'pending',
    retryCount: 0,
  };
  queue.push(newItem);
  console.log(`✅ Added to queue: ${newItem.id} (${newItem.platform})`);
  return newItem;
};

export const getNextPending = (): QueueItem | null => {
  const sorted = queue
    .filter(item => item.status === 'pending')
    .sort((a, b) => {
      // High priority first
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
    });
  return sorted[0] || null;
};

export const markPublished = (id: string, success: boolean) => {
  const item = queue.find(q => q.id === id);
  if (item) {
    if (success) {
      item.status = 'published';
      console.log(`✅ Published: ${id}`);
    } else {
      item.retryCount += 1;
      if (item.retryCount >= MAX_RETRIES) {
        item.status = 'failed';
        console.error(`❌ Failed after ${MAX_RETRIES} retries: ${id}`);
      } else {
        item.status = 'pending';
        // Reschedule with backoff
        const backoffMinutes = Math.pow(2, item.retryCount) * 5;
        item.scheduledTime = new Date(Date.now() + backoffMinutes * 60000);
        console.log(`🔄 Retry ${item.retryCount}/${MAX_RETRIES} for ${id} in ${backoffMinutes}min`);
      }
    }
  }
};

export const getQueueStatus = () => {
  const stats = {
    pending: queue.filter(q => q.status === 'pending').length,
    processing: queue.filter(q => q.status === 'processing').length,
    published: queue.filter(q => q.status === 'published').length,
    failed: queue.filter(q => q.status === 'failed').length,
    total: queue.length,
  };
  return stats;
};