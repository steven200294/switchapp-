import type { Request, Response, NextFunction } from 'express';
import * as messagesService from './messages.service.js';

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

export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const message = await messagesService.sendMessage(req.params.id as string, req.userId!, req.body.content);
    res.status(201).json({ data: message });
  } catch (err) { next(err); }
}
