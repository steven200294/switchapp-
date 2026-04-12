import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import * as ctrl from './uploads.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.post('/photos', authMiddleware, upload.array('photos', 10), ctrl.uploadPhotos);

export default router;
