import { Router } from 'express';
import * as propertiesController from './properties.controller.js';
import { authMiddleware } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.get('/', propertiesController.list);
router.get('/mine', authMiddleware, propertiesController.myProperties);
router.get('/:id', propertiesController.getById);
router.post('/', authMiddleware, propertiesController.create);
router.put('/:id', authMiddleware, propertiesController.update);
router.delete('/:id', authMiddleware, propertiesController.remove);

export default router;
