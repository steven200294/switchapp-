import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../errors/errorCodes.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError(
        ERROR_CODES.UNAUTHORIZED,
        401,
        CLIENT_MESSAGES[ERROR_CODES.UNAUTHORIZED],
      );
    }

    const token = header.slice(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.userId = decoded.sub;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
      return;
    }
    if (err instanceof jwt.TokenExpiredError) {
      next(new AppError(
        ERROR_CODES.AUTH_EXPIRED_TOKEN,
        401,
        CLIENT_MESSAGES[ERROR_CODES.AUTH_EXPIRED_TOKEN],
      ));
      return;
    }
    next(new AppError(
      ERROR_CODES.AUTH_INVALID_TOKEN,
      401,
      CLIENT_MESSAGES[ERROR_CODES.AUTH_INVALID_TOKEN],
    ));
  }
}
