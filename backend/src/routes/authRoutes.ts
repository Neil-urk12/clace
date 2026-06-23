import { Elysia, t } from 'elysia';
import { AuthService } from '../services/authService';
import { authMiddleware } from '../middlewares/authMiddleware';

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
  .post('/login', async ({ body }) => AuthService.login(body), {
    body: LoginBody,
  })
  .post('/register', async ({ body }) => AuthService.register({
    full_name: body.full_name,
    email: body.email,
    password: body.password,
    is_class_president: body.is_class_president ?? false,
  }), {
    body: RegisterBody,
  });

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