import { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { extractUserFromRequest } from '@common/helpers';

import { UserRole } from '@common/enums';

@Injectable()
export class OwnUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const currentUser = extractUserFromRequest(request);

    const targetUserId = request.params.id;

    if (currentUser?.roles.includes(UserRole.ADMIN)) return true;

    const isForbidden = currentUser && String(currentUser._id) === targetUserId;

    return Boolean(isForbidden);
  }
}
