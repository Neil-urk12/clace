import { Elysia } from 'elysia';
import { AuthService } from '../services/authService';
import { UnauthorizedError } from '../lib/errors';
import type { RouteContext } from '../types/context';

export const authMiddleware = (app: Elysia) =>
  app.derive<{ userId: string }>(async (ctx: any) => {
    const { headers, config, blacklist } = ctx as RouteContext;
    const authorization = headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authorization.slice(7);
    // config and blacklist are injected by the parent app's .derive() in app.ts
    const decoded = await AuthService.verifyToken(token, config, blacklist);

    if (!decoded) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    return {
      userId: decoded.userId
    };
  });
