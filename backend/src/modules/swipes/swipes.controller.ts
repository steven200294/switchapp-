import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as swipesService from './swipes.service.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

const swipeSchema = z.object({
  property_id: z.string().uuid(),
  action: z.enum(['like', 'nope', 'super_like']),
});

export async function recordSwipe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = swipeSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION], parsed.error.message);
    }
    const result = await swipesService.recordSwipe(req.userId!, parsed.data.property_id, parsed.data.action);
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
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const deck = await swipesService.getDeck(req.userId!, limit);
    res.json({ data: deck });
  } catch (err) { next(err); }
}
