import { Router } from 'express';
import * as LinksController from '../controllers/links.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, linkValidators } from '../middleware/validation.middleware';

const router = Router();

// All link management routes require authentication
router.use(authenticate);

// GET /api/links
router.get('/', LinksController.getLinks);

// POST /api/links
router.post('/', validate(linkValidators.create), LinksController.createLink);

// PATCH /api/links/reorder
router.patch('/reorder', validate(linkValidators.reorder), LinksController.reorderLinks);

// PATCH /api/links/:id
router.patch('/:id', validate(linkValidators.update), LinksController.updateLink);

// DELETE /api/links/:id
router.delete('/:id', validate(linkValidators.delete), LinksController.deleteLink);

export default router;
