import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ValidationError } from '../lib/errors';
import type { ProtectedRouteContext } from '../types/context';

const UpdateProfileBody = t.Object({
  name: t.Optional(t.String()),
  email: t.Optional(t.String()),
});

const UpdatePasswordBody = t.Object({
  currentPassword: t.String(),
  newPassword: t.String(),
});

export const profileRoutes = new Elysia({ prefix: '/api/profile' })
  .use(authMiddleware)
  .get('/', async (ctx: any) => {
    const { userStore, userId } = ctx as ProtectedRouteContext;
    const user = await userStore.findById(userId);
    return {
      name: user.fullName,
      email: user.email,
      avatar: user.avatarUrl,
      role: user.role,
      joinDate: user.joinDateFormatted,
    };
  })
  .patch('/', async (ctx: any) => {
    const { userStore, userId, body } = ctx as ProtectedRouteContext;
    const user = await userStore.update(userId, {
      fullName: body.name,
      email: body.email,
    });
    return {
      name: user.fullName,
      email: user.email,
      avatar: user.avatarUrl,
      role: user.role,
      joinDate: user.joinDateFormatted,
    };
  }, {
    body: UpdateProfileBody,
  })
  .post('/password', async (ctx: any) => {
    const { userStore, userId, body } = ctx as ProtectedRouteContext;
    const isValid = await userStore.verifyCredential(userId, body.currentPassword);
    if (!isValid) {
      throw new ValidationError('Current password is incorrect');
    }

    await userStore.updatePassword(userId, body.newPassword);
    return { success: true, message: 'Password updated successfully' };
  }, {
    body: UpdatePasswordBody,
  });
