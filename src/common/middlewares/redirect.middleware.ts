import { NextFunction, Request, Response } from 'express';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { UrlsService } from '@modules/urls/urls.service';

@Injectable()
export class RedirectMiddleware implements NestMiddleware {
  constructor(private readonly urlsService: UrlsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.method !== 'GET') return next();
      const base = String(req.baseUrl || '').trim();
      const pathname = String(req.path || req.originalUrl || '').trim();
      const fullPath = `${base}${pathname}` || '';

      if (
        fullPath === '/' ||
        fullPath.match(/^\/api(\/|$)/) ||
        fullPath.includes('.')
      ) {
        return next();
      }

      const shortId = fullPath.replace(/^\/+/, '');

      if (!shortId) return next();

      const urlDoc = await this.urlsService.findOriginalUrl(shortId);

      if (urlDoc && urlDoc.redirectUrl) {
        await this.urlsService.addVisitHistory(shortId);
        return res.redirect(urlDoc.redirectUrl);
      }

      return next();
    } catch (err) {
      console.error('RedirectMiddleware error:', err);
      return next();
    }
  }
}
