import { z } from 'zod';
import { env } from '../../config/env.js';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(env.pagination.maxLimit).default(env.pagination.defaultLimit),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
