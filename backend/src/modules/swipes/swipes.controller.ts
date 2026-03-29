import type { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env.js';
import * as swipesService from './swipes.service.js';

export async function recordSwipe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await swipesService.recordSwipe(req.userId!, req.body.property_id, req.body.action);
    res.status(201).json({ data: result });
  } catch (err) { next(err); }
}

export async function undo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await swipesService.undoLastSwipe(req.userId!);
    res.json({ data: result });
  } catch (err) { next(err); }
}

export async function getDeck(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = Math.min(
      parseInt(req.query.limit as string) || env.pagination.defaultLimit,
      env.pagination.maxLimit,
    );
    const deck = await swipesService.getDeck(req.userId!, limit);
    res.json({ data: deck });
  } catch (err) { next(err); }
}
