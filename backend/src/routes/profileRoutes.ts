import { Elysia, t } from 'elysia';
import { ProfileModel } from '../models/Profile';
import { authMiddleware } from '../middlewares/authMiddleware';

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
  .get('/', ({ userId }) => ProfileModel.getUserProfile(userId))

  // PATCH /api/profile - Update user profile
  .patch('/', ({ userId, body }) =>
    ProfileModel.updateUserProfile(userId, body)
  , {
    body: UpdateProfileBody,
  })

  // POST /api/profile/password - Update password
  .post('/password', async ({ userId, body }) => {
    const success = await ProfileModel.updatePassword(
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