import { Request, Response } from 'express';
import { logEvent, getLogs, clearLogs } from '../services/logging.service';
import { sendAlert, getAlerts } from '../services/alert.service';

export const logMessage = async (req: Request, res: Response) => {
  const { type, message, data } = req.body;
  if (!type || !message) {
    return res.status(400).json({ error: 'type and message are required' });
  }

  const log = await logEvent(type, message, data);
  res.json({ success: true, log });
};

export const getLogsController = async (req: Request, res: Response) => {
  const { type, limit } = req.query;
  const logs = await getLogs(type as string, Number(limit) || 100);
  res.json({ success: true, count: logs.length, data: logs });
};

export const clearLogsController = async (req: Request, res: Response) => {
  const result = clearLogs();
  res.json(result);
};

export const getSystemAlerts = async (req: Request, res: Response) => {
  const alerts = getAlerts();
  res.json({ success: true, data: alerts });
};

export const triggerAlert = async (req: Request, res: Response) => {
  const { type, message, data } = req.body;
  const alert = await sendAlert(type || 'medium', message || 'Test alert', data);
  res.json({ success: true, alert });
};

export const getSystemHealth = async (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
};