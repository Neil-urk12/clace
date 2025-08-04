import { AuthService } from '../services/authService';

export interface AuthContext {
  userId: string;
}

export const authMiddleware = (app: any) => {
  return app.derive(({ headers, set }: any) => {
    const authorization = headers.authorization;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      set.status = 401;
      throw new Error('Missing or invalid authorization header');
    }

    const token = authorization.split(' ')[1];
    const decoded = AuthService.verifyToken(token);
    
    if (!decoded) {
      set.status = 401;
      throw new Error('Invalid or expired token');
    }

    return {
      userId: decoded.userId
    } as AuthContext;
  });
};
