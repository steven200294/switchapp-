import { Router } from 'express';
import * as ctrl from './matches.controller.js';
import { uuidParamSchema } from '../../shared/schemas/pagination.schema.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.js';

const router = Router();

router.use(authMiddleware);

router.get('/', ctrl.listMyMatches);
router.get('/:id', validate(uuidParamSchema, 'params'), ctrl.getById);

export default router;
