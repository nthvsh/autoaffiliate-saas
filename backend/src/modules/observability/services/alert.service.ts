// Alert system
export const sendAlert = async (type: string, message: string, data?: any) => {
  const alert = {
    id: `alert-${Date.now()}`,
    type, // 'critical', 'high', 'medium', 'low'
    message,
    data,
    timestamp: new Date().toISOString(),
    resolved: false,
  };

  console.log(`🚨 [${type.toUpperCase()}] ${message}`);
  
  // In production: Send email/SMS/webhook
  // if (type === 'critical') {
  //   await sendEmail(adminEmail, `⚠️ ALERT: ${message}`, JSON.stringify(data));
  // }

  return alert;
};

export const getAlerts = () => {
  // Simulate alerts (in production: fetch from database)
  return [
    { type: 'info', message: 'System running normally', timestamp: new Date().toISOString() },
    { type: 'info', message: 'No critical issues detected', timestamp: new Date().toISOString() },
  ];
};