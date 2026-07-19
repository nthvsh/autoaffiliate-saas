import { Request, Response } from 'express';
import { calculateRiskScore, detectShadowban, calculateHumanizationScore } from '../services/compliance.service';

export const getRiskScore = async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId as string;
  const platform = req.params.platform as string;
  const result = await calculateRiskScore(workspaceId, platform);
  res.json(result);
};

export const checkShadowban = async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId as string;
  const platform = req.params.platform as string;
  const result = await detectShadowban(workspaceId, platform);
  res.json(result);
};

export const getHumanizationScore = async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId as string;
  const result = await calculateHumanizationScore(workspaceId);
  res.json(result);
};