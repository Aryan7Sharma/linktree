import { Request, Response, NextFunction } from 'express';
import * as AnalyticsService from '../services/analytics.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export async function getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as AuthenticatedRequest).user;
    const summary = await AnalyticsService.getAnalyticsSummary(user.sub);
    sendSuccess(res, summary);
  } catch (err) {
    next(err);
  }
}
