import type { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await usersService.getMyProfile(req.userId!);
    res.json({ data: profile });
  } catch (err) { next(err); }
}

export async function updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION]);
    }
    const profile = await usersService.updateMyProfile(req.userId!, req.body);
    res.json({ data: profile });
  } catch (err) { next(err); }
}

export async function getPublicProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await usersService.getPublicProfile(req.params.id as string);
    res.json({ data: profile });
  } catch (err) { next(err); }
}
