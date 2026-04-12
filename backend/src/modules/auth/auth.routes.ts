import { Router } from 'express';
import * as authController from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.schemas.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.js';
import { authLimiter } from '../../shared/middlewares/rateLimiter.js';
import { disposableEmailCheck } from '../../shared/middlewares/disposableEmail.js';
import { captchaVerify } from '../../shared/middlewares/captchaVerify.js';

const router = Router();

router.post(
  '/register',
  authLimiter,
  disposableEmailCheck,
  captchaVerify,
  validate(registerSchema),
  authController.register,
);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);

export default router;
