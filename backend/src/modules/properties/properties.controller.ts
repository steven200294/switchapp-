import type { Request, Response, NextFunction } from 'express';
import { listQuerySchema, categoryQuerySchema } from './properties.schemas.js';
import * as propertiesService from './properties.service.js';
import * as feedService from './feed.service.js';
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
    const property = await propertiesService.getById(req.params.id as string, req.userId);
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

export async function myProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await propertiesService.getMyProperty(req.userId!);
    res.json({ data: result });
  } catch (err) { next(err); }
}

export async function feed(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await feedService.getFeed(req.userId);
    res.json({ data: result });
  } catch (err) { next(err); }
}

export async function feedCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, city } = categoryQuerySchema.parse(req.query);
    const slug = req.params.slug as string;
    const result = await feedService.getCategoryPage(slug, page, limit, req.userId, city);
    res.json({ data: result });
  } catch (err) { next(err); }
}

export async function saveDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const property = await propertiesService.saveDraft(req.userId!, req.body);
    res.status(200).json({ data: property });
  } catch (err) { next(err); }
}
