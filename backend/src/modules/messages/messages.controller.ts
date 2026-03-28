import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as messagesService from './messages.service.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function listConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const conversations = await messagesService.listConversations(req.userId!);
    res.json({ data: conversations });
  } catch (err) { next(err); }
}

export async function getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 30));
    const result = await messagesService.getMessages(req.params.id as string, req.userId!, page, limit);
    res.json({ data: result });
  } catch (err) { next(err); }
}

const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});

export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = sendMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION], parsed.error.message);
    }
    const message = await messagesService.sendMessage(req.params.id as string, req.userId!, parsed.data.content);
    res.status(201).json({ data: message });
  } catch (err) { next(err); }
}
