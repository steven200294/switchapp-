import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../errors/errorCodes.js';
import { DISPOSABLE_DOMAINS } from '../../modules/verification/data/disposable-domains.js';

export function disposableEmailCheck(req: Request, _res: Response, next: NextFunction): void {
  const email = req.body?.email;
  if (typeof email !== 'string') return next();

  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && DISPOSABLE_DOMAINS.has(domain)) {
    return next(
      new AppError(ERROR_CODES.AUTH_DISPOSABLE_EMAIL, 422, CLIENT_MESSAGES[ERROR_CODES.AUTH_DISPOSABLE_EMAIL]),
    );
  }
  next();
}
