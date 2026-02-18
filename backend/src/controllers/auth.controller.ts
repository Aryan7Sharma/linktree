import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import { AuthenticatedRequest, RegisterBody, LoginBody, RefreshTokenBody } from '../types';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as RegisterBody;
    const result = await AuthService.registerUser(body);
    sendCreated(res, result, 'Account created successfully');
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as LoginBody;
    const result = await AuthService.loginUser(body);
    sendSuccess(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body as RefreshTokenBody;
    const tokens = await AuthService.refreshAccessToken(refreshToken);
    sendSuccess(res, tokens, 'Token refreshed');
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as AuthenticatedRequest).user;
    const { refreshToken } = req.body as { refreshToken?: string };
    await AuthService.logoutUser(user.sub, refreshToken);
    sendNoContent(res);
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as AuthenticatedRequest).user;
    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
}
