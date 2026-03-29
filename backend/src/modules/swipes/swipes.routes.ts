import { Router } from 'express';
import * as ctrl from './swipes.controller.js';
import { swipeBodySchema } from './swipes.schemas.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.js';

const router = Router();

router.use(authMiddleware);

router.get('/deck', ctrl.getDeck);
router.post('/', validate(swipeBodySchema), ctrl.recordSwipe);
router.delete('/undo', ctrl.undo);

export default router;
