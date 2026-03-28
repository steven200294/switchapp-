import { Router } from 'express';
import * as usersController from './users.controller.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.get('/me/profile', authMiddleware, usersController.getMyProfile);
router.put('/me/profile', authMiddleware, usersController.updateMyProfile);
router.get('/:id/public', usersController.getPublicProfile);

export default router;
