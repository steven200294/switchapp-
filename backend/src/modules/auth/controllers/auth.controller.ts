import type { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.schemas.js';
import * as authService from '../services/auth.service.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../../shared/errors/errorCodes.js';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        ERROR_CODES.VALIDATION,
        400,
        CLIENT_MESSAGES[ERROR_CODES.VALIDATION],
        parsed.error.message,
      );
    }

    const result = await authService.register(parsed.data);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        ERROR_CODES.VALIDATION,
        400,
        CLIENT_MESSAGES[ERROR_CODES.VALIDATION],
        parsed.error.message,
      );
    }

    const result = await authService.login(parsed.data);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(
        ERROR_CODES.UNAUTHORIZED,
        401,
        CLIENT_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      );
    }

    const user = await authService.getMe(userId);
    res.json({ data: { user } });
  } catch (err) {
    next(err);
  }
}
