import { Elysia, t } from 'elysia';
import { ProfileModel } from '../models/Profile';
import { authMiddleware } from '../middlewares/authMiddleware';
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

  // GET /api/profile - Get user profile
  .get('/', (ctx: any) => {
    const { db, userId } = ctx as ProtectedRouteContext;
    return ProfileModel.getUserProfile(db, userId);
  })

  // PATCH /api/profile - Update user profile
  .patch('/', (ctx: any) => {
    const { db, userId, body } = ctx as ProtectedRouteContext;
    return ProfileModel.updateUserProfile(db, userId, body);
  }, {
    body: UpdateProfileBody,
  })

  // POST /api/profile/password - Update password
  .post('/password', async (ctx: any) => {
    const { db, userId, body } = ctx as ProtectedRouteContext;
    const success = await ProfileModel.updatePassword(
      db,
      userId,
      body.currentPassword,
      body.newPassword
    );
    if (!success) {
      return { success: false, message: 'Failed to update password' };
    }
    return { success: true, message: 'Password updated successfully' };
  }, {
    body: UpdatePasswordBody,
  });
