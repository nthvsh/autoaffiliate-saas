import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, error } = await registerUser(email, password);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, data });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, error } = await loginUser(email, password);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, data });
};