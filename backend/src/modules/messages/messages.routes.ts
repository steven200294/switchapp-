import { Router } from 'express';
import * as ctrl from './messages.controller.js';
import { sendMessageSchema } from './messages.schemas.js';
import { uuidParamSchema } from '../../shared/schemas/pagination.schema.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.js';

const router = Router();

router.use(authMiddleware);

router.get('/conversations', ctrl.listConversations);
router.get('/conversations/:id/messages', validate(uuidParamSchema, 'params'), ctrl.getMessages);
router.post('/conversations/:id/messages', validate(uuidParamSchema, 'params'), validate(sendMessageSchema), ctrl.sendMessage);

export default router;
