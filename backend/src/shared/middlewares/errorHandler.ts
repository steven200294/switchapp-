import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES, CLIENT_MESSAGES } from "../errors/errorCodes.js";
import { logger } from "../../config/logger.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.error(`[${err.code}] ${err.message}`, {
      statusCode: err.statusCode,
      stack: err.stack,
    });

    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.clientMessage,
      },
    });
    return;
  }

  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;

  logger.error(`[UNHANDLED] ${message}`, { stack });

  res.status(500).json({
    error: {
      code: ERROR_CODES.INTERNAL,
      message:
        process.env.NODE_ENV === "development"
          ? message
          : CLIENT_MESSAGES[ERROR_CODES.INTERNAL],
    },
  });
}
