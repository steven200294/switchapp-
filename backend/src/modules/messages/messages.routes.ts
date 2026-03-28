import { Router } from 'express';
import * as messagesController from './messages.controller.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/conversations', messagesController.listConversations);
router.get('/conversations/:id/messages', messagesController.getMessages);
router.post('/conversations/:id/messages', messagesController.sendMessage);

export default router;
