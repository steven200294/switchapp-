import { Router } from 'express';
import * as favoritesController from './favorites.controller.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', favoritesController.list);
router.post('/', favoritesController.add);
router.delete('/:propertyId', favoritesController.remove);

export default router;
