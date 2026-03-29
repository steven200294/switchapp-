import { Router } from 'express';
import * as ctrl from './users.controller.js';
import { updateProfileSchema } from './users.schemas.js';
import { uuidParamSchema } from '../../shared/schemas/pagination.schema.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.js';

const router = Router();

router.get('/me/profile', authMiddleware, ctrl.getMyProfile);
router.put('/me/profile', authMiddleware, validate(updateProfileSchema), ctrl.updateMyProfile);
router.get('/:id/public', validate(uuidParamSchema, 'params'), ctrl.getPublicProfile);

export default router;
