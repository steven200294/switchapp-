import { Router } from 'express';
import { authMiddleware, adminOnlyMiddleware } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.js';
import { uuidParamSchema } from '../../shared/schemas/pagination.schema.js';
import * as ctrl from './admin.controller.js';

const router = Router();

router.use(authMiddleware);
router.use(adminOnlyMiddleware);

router.get('/dashboard', ctrl.getDashboard);
router.get('/users', ctrl.listUsers);
router.get('/users/:id', validate(uuidParamSchema, 'params'), ctrl.getUserById);
router.get('/properties', ctrl.listProperties);
router.get('/matches', ctrl.listMatches);
router.get('/swipes', ctrl.listSwipes);
router.get('/swipes/stats', ctrl.getSwipeStats);
router.get('/conversations', ctrl.listConversations);
router.get('/conversations/:id', validate(uuidParamSchema, 'params'), ctrl.getConversationMessages);
router.get('/metrics/prometheus', ctrl.getPrometheusMetrics);
router.get('/metrics/summary', ctrl.getMetricsSummary);

export default router;
