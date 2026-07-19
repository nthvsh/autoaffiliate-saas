import { supabase } from '../../../config/database';

// In-memory log storage (production: use database)
const logs: any[] = [];
const MAX_LOGS = 1000;

export const logEvent = async (type: string, message: string, data?: any) => {
  const logEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    type, // 'info', 'error', 'warn', 'debug'
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  logs.unshift(logEntry);
  if (logs.length > MAX_LOGS) logs.pop();

  // Also log to console
  console.log(`📋 [${type.toUpperCase()}] ${message}`);

  // Save to database (optional)
  try {
    await supabase.from('compliance_logs').insert([{
      event_type: `log_${type}`,
      details: { message, data },
      timestamp: new Date().toISOString(),
    }]);
  } catch (error) {
    // Silently fail for logging
  }

  return logEntry;
};

export const getLogs = async (type?: string, limit: number = 100) => {
  let filtered = logs;
  if (type) {
    filtered = logs.filter(log => log.type === type);
  }
  return filtered.slice(0, limit);
};

export const clearLogs = () => {
  logs.length = 0;
  return { success: true, message: 'Logs cleared' };
};