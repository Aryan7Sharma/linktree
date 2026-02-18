import { Router } from 'express';
import * as ProfileController from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, profileValidators } from '../middleware/validation.middleware';

const router = Router();

// GET /api/profile/me — get authenticated user's full profile
router.get('/me', authenticate, ProfileController.getMyProfile);

// PATCH /api/profile/me — update authenticated user's profile
router.patch('/me', authenticate, validate(profileValidators.update), ProfileController.updateProfile);

// GET /api/profile/check/:username — check username availability
router.get('/check/:username', ProfileController.checkUsername);

export default router;
