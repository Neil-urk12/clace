import { Elysia } from 'elysia';
import { AuthService } from '../services/authService';
import { UnauthorizedError } from '../lib/errors';

export const authMiddleware = (app: Elysia) =>
  app.derive<{ userId: string }>(({ headers }) => {
    const authorization = headers.authorization;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authorization.split(' ')[1];
    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    return {
      userId: decoded.userId
    };
  });
