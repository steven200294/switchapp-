import type { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await adminService.getDashboard();
    res.json({ data: stats });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const result = await adminService.listUsers(page, limit);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const user = await adminService.getUserById(id);
    if (!user) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        404,
        CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND],
        `Admin: user not found: ${id}`,
      );
    }
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function listProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const result = await adminService.listProperties(page, limit);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}
