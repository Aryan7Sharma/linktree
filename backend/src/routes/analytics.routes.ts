import { Router } from 'express';
import * as AnalyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

// GET /api/analytics/summary
router.get('/summary', AnalyticsController.getSummary);

export default router;
