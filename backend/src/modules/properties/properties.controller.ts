import type { Request, Response, NextFunction } from 'express';
import { createPropertySchema, updatePropertySchema, listQuerySchema } from './properties.schemas.js';
import * as propertiesService from './properties.service.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION], parsed.error.message);
    }
    const { page, limit, ...filters } = parsed.data;
    const result = await propertiesService.list(filters, page, limit);
    res.json({ data: result });
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const property = await propertiesService.getById(req.params.id as string);
    res.json({ data: property });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createPropertySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION], parsed.error.message);
    }
    const property = await propertiesService.create(req.userId!, parsed.data);
    res.status(201).json({ data: property });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = updatePropertySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION], parsed.error.message);
    }
    const property = await propertiesService.update(req.params.id as string, req.userId!, parsed.data);
    res.json({ data: property });
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await propertiesService.remove(req.params.id as string, req.userId!);
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function myProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const properties = await propertiesService.getByOwnerId(req.userId!);
    res.json({ data: properties });
  } catch (err) { next(err); }
}
