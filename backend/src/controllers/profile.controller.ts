import { Request, Response, NextFunction } from 'express';
import * as ProfileService from '../services/profile.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest, UpdateProfileBody } from '../types';

export async function getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as AuthenticatedRequest).user;
    const profile = await ProfileService.getMyProfile(user.sub);
    sendSuccess(res, profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as AuthenticatedRequest).user;
    const body = req.body as UpdateProfileBody;
    const updated = await ProfileService.updateProfile(user.sub, body);
    sendSuccess(res, updated, 'Profile updated');
  } catch (err) {
    next(err);
  }
}

export async function checkUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username } = req.params;
    const available = await ProfileService.checkUsernameAvailable(username);
    sendSuccess(res, { available });
  } catch (err) {
    next(err);
  }
}

export async function getPublicProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username } = req.params;
    const [profile] = await Promise.all([
      ProfileService.getProfileByUsername(username),
      ProfileService.recordProfileView(username, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        referer: req.headers['referer'],
      }).catch(() => { /* Non-critical, don't fail request */ }),
    ]);
    sendSuccess(res, profile);
  } catch (err) {
    next(err);
  }
}
