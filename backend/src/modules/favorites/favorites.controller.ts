import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as favoritesService from './favorites.service.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const favorites = await favoritesService.listMyFavorites(req.userId!);
    res.json({ data: favorites });
  } catch (err) { next(err); }
}

const addSchema = z.object({
  property_id: z.string().uuid(),
});

export async function add(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = addSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION], parsed.error.message);
    }
    const favorite = await favoritesService.addFavorite(req.userId!, parsed.data.property_id);
    res.status(201).json({ data: favorite });
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await favoritesService.removeFavorite(req.userId!, req.params.propertyId as string);
    res.status(204).send();
  } catch (err) { next(err); }
}
