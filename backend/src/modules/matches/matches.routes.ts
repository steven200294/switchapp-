import { Router } from 'express';
import * as matchesController from './matches.controller.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', matchesController.listMyMatches);
router.get('/:id', matchesController.getById);

export default router;
