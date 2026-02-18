import { Router } from 'express';
import * as ProfileController from '../controllers/profile.controller';
import * as LinksController from '../controllers/links.controller';
import * as AnalyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';
import { publicProfileRateLimiter } from '../middleware/rateLimiter.middleware';
import { param } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// GET /api/public/:username — public profile + links
router.get(
  '/:username',
  publicProfileRateLimiter,
  ProfileController.getPublicProfile
);

// GET /api/public/:username/links — public links for a user
router.get(
  '/:username/links',
  publicProfileRateLimiter,
  async (req, res, next) => {
    const { username } = req.params;
    try {
      const { getPublicLinksByUsername } = await import('../services/links.service');
      const links = await getPublicLinksByUsername(username);
      res.json({ success: true, data: links });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/public/click/:id — record a link click (public, no auth)
router.post(
  '/click/:id',
  validate([param('id').isUUID().withMessage('Invalid link ID')]),
  LinksController.trackClick
);

// GET /api/analytics/summary — protected analytics (own user)
router.get('/analytics/summary', authenticate, AnalyticsController.getSummary);

export default router;
