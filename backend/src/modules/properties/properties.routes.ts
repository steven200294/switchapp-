import { Router } from 'express';
import * as ctrl from './properties.controller.js';
import { createPropertySchema, updatePropertySchema, listQuerySchema } from './properties.schemas.js';
import { uuidParamSchema } from '../../shared/schemas/pagination.schema.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.js';

const router = Router();

router.get('/', validate(listQuerySchema, 'query'), ctrl.list);
router.get('/mine', authMiddleware, ctrl.myProperties);
router.get(
  '/:id/compatibility',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  ctrl.getCompatibility,
);
router.get('/:id', validate(uuidParamSchema, 'params'), ctrl.getById);
router.post('/', authMiddleware, validate(createPropertySchema), ctrl.create);
router.put('/:id', authMiddleware, validate(uuidParamSchema, 'params'), validate(updatePropertySchema), ctrl.update);
router.delete('/:id', authMiddleware, validate(uuidParamSchema, 'params'), ctrl.remove);

export default router;
