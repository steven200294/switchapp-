import { Router } from 'express';
import * as ctrl from './properties.controller.js';
import { createPropertySchema, updatePropertySchema, listQuerySchema, saveDraftSchema } from './properties.schemas.js';
import { uuidParamSchema } from '../../shared/schemas/pagination.schema.js';
import { authMiddleware, optionalAuth } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.js';

const router = Router();

router.get('/feed', optionalAuth, ctrl.feed);
router.get('/feed/:slug', optionalAuth, ctrl.feedCategory);
router.get('/', validate(listQuerySchema, 'query'), ctrl.list);
router.get('/me', authMiddleware, ctrl.myProperty);
router.get(
  '/:id/compatibility',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  ctrl.getCompatibility,
);
router.get('/:id', validate(uuidParamSchema, 'params'), ctrl.getById);
router.post('/', authMiddleware, validate(createPropertySchema), ctrl.create);
router.post('/draft', authMiddleware, validate(saveDraftSchema), ctrl.saveDraft);
router.put('/:id', authMiddleware, validate(uuidParamSchema, 'params'), validate(updatePropertySchema), ctrl.update);
router.delete('/:id', authMiddleware, validate(uuidParamSchema, 'params'), ctrl.remove);

export default router;
