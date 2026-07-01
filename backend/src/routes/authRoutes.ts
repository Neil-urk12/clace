import { Elysia, t } from 'elysia';
import { AuthService } from '../services/authService';
import { authMiddleware } from '../middlewares/authMiddleware';
import type { RouteContext, ProtectedRouteContext } from '../types/context';

const LoginBody = t.Object({
  email: t.String(),
  password: t.String(),
});

const RegisterBody = t.Object({
  full_name: t.String(),
  email: t.String(),
  password: t.String(),
  is_class_president: t.Optional(t.Boolean()),
});

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .post('/login', async (ctx: any) => {
    const { body, db, config } = ctx as RouteContext;
    return AuthService.login(db, body, config);
  }, {
    body: LoginBody,
  })
  .post('/register', async (ctx: any) => {
    const { body, db, config } = ctx as RouteContext;
    return AuthService.register(db, {
      full_name: body.full_name,
      email: body.email,
      password: body.password,
      is_class_president: body.is_class_president ?? false,
    }, config);
  }, {
    body: RegisterBody,
  });

const protectedAuthRoutes = new Elysia()
  .use(authMiddleware)
  .post('/logout', (ctx: any) => {
    const { headers, config, blacklist } = ctx as ProtectedRouteContext;
    return AuthService.logout((headers.authorization ?? '').replace('Bearer ', ''), config, blacklist);
  })
  .get('/me', async (ctx: any) => {
    const { db, userId } = ctx as ProtectedRouteContext;
    const user = await AuthService.getUserById(db, userId);
    if (!user) return null;
    return user;
  });

export const authProtectedRoutes = new Elysia({ prefix: '/api/auth' }).use(protectedAuthRoutes);
