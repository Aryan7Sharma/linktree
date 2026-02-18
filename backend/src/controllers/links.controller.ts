import { Request, Response, NextFunction } from 'express';
import * as LinksService from '../services/links.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import { AuthenticatedRequest, CreateLinkBody, UpdateLinkBody, ReorderLinksBody } from '../types';

export async function getLinks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    console.log('Fetching links for user:', (req as AuthenticatedRequest).user.sub);
    const user = (req as AuthenticatedRequest).user;
    console.log('User ID from token:', user);
    const links = await LinksService.getLinksByUserId(user.sub);
    sendSuccess(res, links);
  } catch (err) {
    next(err);
  }
}

export async function createLink(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as AuthenticatedRequest).user;
    const body = req.body as CreateLinkBody;
    const link = await LinksService.createLink(user.sub, body);
    sendCreated(res, link, 'Link created');
  } catch (err) {
    next(err);
  }
}

export async function updateLink(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    const body = req.body as UpdateLinkBody;
    const link = await LinksService.updateLink(id, user.sub, body);
    sendSuccess(res, link, 'Link updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteLink(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    await LinksService.deleteLink(id, user.sub);
    sendNoContent(res);
  } catch (err) {
    next(err);
  }
}

export async function reorderLinks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as AuthenticatedRequest).user;
    const body = req.body as ReorderLinksBody;
    await LinksService.reorderLinks(user.sub, body);
    sendSuccess(res, null, 'Links reordered');
  } catch (err) {
    next(err);
  }
}

export async function trackClick(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await LinksService.recordLinkClick(id, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers['referer'],
    });
    sendNoContent(res);
  } catch (err) {
    next(err);
  }
}
