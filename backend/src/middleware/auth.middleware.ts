import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

/**
 * Middleware: Verify JWT access token on protected routes.
 * Attaches the decoded JWT payload to `req.user`.
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'Authorization header missing or malformed', 401);
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch {
    sendError(res, 'Invalid or expired access token', 401);
  }
}

/**
 * Middleware: Optionally authenticate - does not fail if no token present.
 * Useful for public endpoints that have slightly different behavior when authenticated.
 */
export function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const payload = verifyAccessToken(token);
      (req as AuthenticatedRequest).user = payload;
    } catch {
      // Silently ignore invalid tokens on optional auth
    }
  }

  next();
}
