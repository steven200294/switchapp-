import type { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service.js';
import { register } from '../../infra/metrics/prometheus.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

function parsePagination(req: Request): { page: number; limit: number } {
  return {
    page: Math.max(1, parseInt(req.query.page as string, 10) || 1),
    limit: Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20)),
  };
}

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
    const { page, limit } = parsePagination(req);
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
    const { page, limit } = parsePagination(req);
    const result = await adminService.listProperties(page, limit);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function listMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit } = parsePagination(req);
    const result = await adminService.listMatches(page, limit);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function listSwipes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit } = parsePagination(req);
    const result = await adminService.listSwipes(page, limit);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function getSwipeStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await adminService.getSwipeStats();
    res.json({ data: stats });
  } catch (err) {
    next(err);
  }
}

export async function listConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit } = parsePagination(req);
    const result = await adminService.listConversations(page, limit);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function getConversationMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const conversationId = req.params.id as string;
    const { page, limit } = parsePagination(req);
    const result = await adminService.getConversationMessages(conversationId, page, limit);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function getPrometheusMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    next(err);
  }
}

export async function getMetricsSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const summary = await adminService.getMetricsSummary();
    res.json({ data: summary });
  } catch (err) {
    next(err);
  }
}
