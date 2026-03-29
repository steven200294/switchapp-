import type { Request, Response, NextFunction } from 'express';
import { listQuerySchema } from './properties.schemas.js';
import * as propertiesService from './properties.service.js';
import * as compatibilityService from '../compatibility/compatibility.service.js';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, ...filters } = listQuerySchema.parse(req.query);
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

export async function getCompatibility(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await compatibilityService.getCompatibilityForProperty(
      req.userId!,
      req.params.id as string,
    );
    res.json({ data });
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const property = await propertiesService.create(req.userId!, req.body);
    res.status(201).json({ data: property });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const property = await propertiesService.update(req.params.id as string, req.userId!, req.body);
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
