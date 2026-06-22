import { Elysia } from 'elysia';
import { AuthService } from '../services/authService';
import { authMiddleware } from '../middlewares/authMiddleware';

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .post('/login', async ({ body }) => AuthService.login(body as any))
  .post('/register', async ({ body }) => AuthService.register(body as any));

const protectedAuthRoutes = new Elysia()
  .use(authMiddleware)
  .post('/logout', ({ headers, userId }) =>
    AuthService.logout((headers.authorization ?? '').replace('Bearer ', ''))
  )
  .get('/me', async ({ userId }) => {
    const user = await AuthService.getUserById(userId);
    if (!user) return null;
    return user;
  });

export const authProtectedRoutes = new Elysia({ prefix: '/api/auth' }).use(protectedAuthRoutes);
