import { Router } from 'express';
import * as swipesController from './swipes.controller.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/deck', swipesController.getDeck);
router.post('/', swipesController.recordSwipe);
router.delete('/undo', swipesController.undo);

export default router;
