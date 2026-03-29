import type { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ data: result });
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.login(req.body);
    res.json({ data: result });
  } catch (err) { next(err); }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 401, CLIENT_MESSAGES[ERROR_CODES.UNAUTHORIZED]);
    }
    const user = await authService.getMe(req.userId);
    res.json({ data: { user } });
  } catch (err) { next(err); }
}
