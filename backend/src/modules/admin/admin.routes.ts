import { Router } from 'express';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import * as adminController from './admin.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserById);
router.get('/properties', adminController.listProperties);

export default router;
