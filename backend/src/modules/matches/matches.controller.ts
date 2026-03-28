import type { Request, Response, NextFunction } from 'express';
import * as matchesService from './matches.service.js';

export async function listMyMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const matches = await matchesService.listMyMatches(req.userId!);
    res.json({ data: matches });
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await matchesService.getMatchById(req.params.id as string, req.userId!);
    res.json({ data: result });
  } catch (err) { next(err); }
}
