import { Request, Response } from 'express';
import { 
  getPrompts, 
  getPromptsByCategory, 
  createPrompt, 
  updatePrompt, 
  deletePrompt 
} from '../services/prompt.service';

export const getAllPrompts = async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId as string;
  const { data, error } = await getPrompts(workspaceId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
};

export const getPromptsByCategoryController = async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId as string;
  const category = req.params.category as string;
  const { data, error } = await getPromptsByCategory(workspaceId, category);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
};

export const createPromptController = async (req: Request, res: Response) => {
  const { workspaceId, name, category, promptText, variables } = req.body;
  const { data, error } = await createPrompt(workspaceId, name, category, promptText, variables);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
};

export const updatePromptController = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updates = req.body;
  const { data, error } = await updatePrompt(id, updates);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
};

export const deletePromptController = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { error } = await deletePrompt(id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, message: 'Prompt deleted' });
};