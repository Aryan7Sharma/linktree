import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, authValidators } from '../middleware/validation.middleware';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', authRateLimiter, validate(authValidators.register), AuthController.register);

// POST /api/auth/login
router.post('/login', authRateLimiter, validate(authValidators.login), AuthController.login);

// POST /api/auth/refresh
router.post('/refresh', validate(authValidators.refreshToken), AuthController.refreshToken);

// POST /api/auth/logout (requires auth)
router.post('/logout', authenticate, AuthController.logout);

// GET /api/auth/me (requires auth)
router.get('/me', authenticate, AuthController.me);

export default router;
