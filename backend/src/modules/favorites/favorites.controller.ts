import type { Request, Response, NextFunction } from 'express';
import * as favoritesService from './favorites.service.js';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const favorites = await favoritesService.listMyFavorites(req.userId!);
    res.json({ data: favorites });
  } catch (err) { next(err); }
}

export async function add(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const favorite = await favoritesService.addFavorite(req.userId!, req.body.property_id);
    res.status(201).json({ data: favorite });
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await favoritesService.removeFavorite(req.userId!, req.params.propertyId as string);
    res.status(204).send();
  } catch (err) { next(err); }
}
