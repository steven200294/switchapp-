import type { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../errors/errorCodes.js';

export async function captchaVerify(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = req.body?.captcha_token;

  if (!env.captcha.enabled) {
    return next();
  }

  if (env.isDev && token === 'dev-bypass') {
    return next();
  }

  if (!token || typeof token !== 'string') {
    return next(
      new AppError(ERROR_CODES.AUTH_CAPTCHA_FAILED, 422, CLIENT_MESSAGES[ERROR_CODES.AUTH_CAPTCHA_FAILED]),
    );
  }

  if (!env.captcha.secretKey) {
    logger.warn('CAPTCHA_SECRET_KEY not set — skipping verification');
    return next();
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.captcha.secretKey,
        response: token,
        remoteip: req.ip,
      }),
    });

    const result = (await response.json()) as { success: boolean };
    if (!result.success) {
      return next(
        new AppError(ERROR_CODES.AUTH_CAPTCHA_FAILED, 422, CLIENT_MESSAGES[ERROR_CODES.AUTH_CAPTCHA_FAILED]),
      );
    }

    next();
  } catch (err) {
    logger.error(`CAPTCHA verification request failed: ${err instanceof Error ? err.message : String(err)}`);
    return next(
      new AppError(ERROR_CODES.AUTH_CAPTCHA_FAILED, 422, CLIENT_MESSAGES[ERROR_CODES.AUTH_CAPTCHA_FAILED]),
    );
  }
}
