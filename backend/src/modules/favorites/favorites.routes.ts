import { Router } from 'express';
import * as ctrl from './favorites.controller.js';
import { addFavoriteBodySchema, favoritesRemoveParamsSchema } from './favorites.schemas.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.js';

const router = Router();

router.use(authMiddleware);

router.get('/', ctrl.list);
router.post('/', validate(addFavoriteBodySchema), ctrl.add);
router.delete('/:propertyId', validate(favoritesRemoveParamsSchema, 'params'), ctrl.remove);

export default router;
