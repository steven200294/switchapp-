import rateLimit from 'express-rate-limit';
import { ERROR_CODES, CLIENT_MESSAGES } from '../errors/errorCodes.js';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: ERROR_CODES.RATE_LIMIT,
      message: CLIENT_MESSAGES[ERROR_CODES.RATE_LIMIT],
    },
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: ERROR_CODES.RATE_LIMIT,
      message: CLIENT_MESSAGES[ERROR_CODES.RATE_LIMIT],
    },
  },
});
