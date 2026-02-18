import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, body, param } from 'express-validator';
import { sendError } from '../utils/response';

/**
 * Runs express-validator chains and returns errors as a unified response.
 */
export function validate(chains: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validation chains in parallel
    await Promise.all(chains.map((chain) => chain.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formatted = errors.array().map((e) => ({
        field: e.type === 'field' ? (e as { path: string }).path : 'unknown',
        message: e.msg as string,
      }));
      sendError(res, 'Validation failed', 422, formatted);
      return;
    }

    next();
  };
}

// =============================================
// Reusable Validation Rule Sets
// =============================================

export const authValidators = {
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and a number'),
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3-30 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username may only contain letters, numbers, hyphens, and underscores'),
    body('display_name')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Display name may not exceed 50 characters'),
  ],

  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],

  refreshToken: [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ],
};

export const linkValidators = {
  create: [
    body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
    body('url').isURL({ require_protocol: true }).withMessage('Valid URL with protocol is required'),
  ],

  update: [
    param('id').isUUID().withMessage('Invalid link ID'),
    body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be 1-100 characters'),
    body('url').optional().isURL({ require_protocol: true }).withMessage('Valid URL with protocol is required'),
    body('is_active').optional().isBoolean().withMessage('is_active must be boolean'),
    body('sort_order').optional().isInt({ min: 0 }).withMessage('sort_order must be a non-negative integer'),
  ],

  reorder: [
    body('links').isArray({ min: 1 }).withMessage('links must be a non-empty array'),
    body('links.*.id').isUUID().withMessage('Each link must have a valid UUID'),
    body('links.*.sort_order').isInt({ min: 0 }).withMessage('Each link must have a valid sort_order'),
  ],

  delete: [param('id').isUUID().withMessage('Invalid link ID')],
};

export const profileValidators = {
  update: [
    body('display_name').optional().trim().isLength({ max: 50 }).withMessage('Display name max 50 chars'),
    body('bio').optional().trim().isLength({ max: 280 }).withMessage('Bio max 280 characters'),
    body('avatar_url').optional().isURL().withMessage('Avatar must be a valid URL'),
    body('theme')
      .optional()
      .isIn(['classic', 'dark', 'nature', 'sunset', 'ocean', 'purple'])
      .withMessage('Invalid theme'),
  ],
};
