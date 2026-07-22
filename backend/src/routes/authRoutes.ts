import { Elysia, t } from 'elysia';
import { AuthService } from '../services/authService';
import { authMiddleware } from '../middlewares/authMiddleware';
import { UnauthorizedError } from '../lib/errors';
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
    const { body, userStore, config } = ctx as RouteContext;
    const user = await userStore.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await userStore.verifyCredential(user.id, body.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = await AuthService.generateToken(user.id, config);
    return {
      token,
      user: {
        user_id: user.id,
        full_name: user.fullName,
        email: user.email,
        is_class_president: user.isClassPresident,
      },
    };
  }, {
    body: LoginBody,
  })
  .post('/register', async (ctx: any) => {
    const { body, userStore, config } = ctx as RouteContext;
    const user = await userStore.create({
      fullName: body.full_name,
      email: body.email,
      passwordPlain: body.password,
      isClassPresident: body.is_class_president ?? false,
    });

    const token = await AuthService.generateToken(user.id, config);
    return {
      token,
      user: {
        user_id: user.id,
        full_name: user.fullName,
        email: user.email,
        is_class_president: user.isClassPresident,
      },
    };
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
    const { userStore, userId } = ctx as ProtectedRouteContext;
    const user = await userStore.findById(userId);
    return {
      user_id: user.id,
      full_name: user.fullName,
      email: user.email,
      is_class_president: user.isClassPresident,
    };
  });

export const authProtectedRoutes = new Elysia({ prefix: '/api/auth' }).use(protectedAuthRoutes);
