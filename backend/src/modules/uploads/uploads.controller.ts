import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import minioClient, { ensureBucket, getPublicUrl } from '../../infra/storage/minio.js';
import { env } from '../../config/env.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILES = 10;

export async function uploadPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files?.length) {
      throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION], 'No files provided');
    }

    if (files.length > MAX_FILES) {
      throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION], `Maximum ${MAX_FILES} files allowed`);
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION]);
      }
    }

    const bucket = env.minio.bucketProperties;
    await ensureBucket(bucket);

    const userId = req.userId!;
    const urls: string[] = [];
    const paths: string[] = [];

    for (const file of files) {
      const ext = file.originalname.split('.').pop() ?? 'jpg';
      const objectName = `${userId}/${randomUUID()}.${ext}`;

      await minioClient.putObject(
        bucket,
        objectName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );

      paths.push(objectName);
      urls.push(getPublicUrl(bucket, objectName));
    }

    res.json({ data: { urls, paths } });
  } catch (err) { next(err); }
}
