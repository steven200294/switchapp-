import { Router } from 'express';
import * as ctrl from './verification.controller.js';
import { sendEmailSchema, sendPhoneOtpSchema, verifyPhoneOtpSchema } from './verification.schemas.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.js';
import { authLimiter } from '../../shared/middlewares/rateLimiter.js';

const router = Router();

router.post('/email/send', authLimiter, authMiddleware, validate(sendEmailSchema), ctrl.sendEmailVerification);
router.get('/email/confirm', ctrl.confirmEmail);

router.post('/phone/send', authLimiter, authMiddleware, validate(sendPhoneOtpSchema), ctrl.sendPhoneOtp);
router.post('/phone/verify', authLimiter, authMiddleware, validate(verifyPhoneOtpSchema), ctrl.verifyPhoneOtp);

export default router;
