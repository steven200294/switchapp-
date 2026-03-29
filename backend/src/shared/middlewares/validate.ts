import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../errors/errorCodes.js';

type Source = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, source: Source = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      next(
        new AppError(
          ERROR_CODES.VALIDATION,
          400,
          CLIENT_MESSAGES[ERROR_CODES.VALIDATION],
          parsed.error.message,
        ),
      );
      return;
    }
    if (source === 'body') {
      req.body = parsed.data;
    }
    next();
  };
}
