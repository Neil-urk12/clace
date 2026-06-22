import { Elysia } from 'elysia';
import { ProfileModel } from '../models/Profile';
import { authMiddleware } from '../middlewares/authMiddleware';

export const profileRoutes = new Elysia({ prefix: '/api/profile' })
  .use(authMiddleware)

  // GET /api/profile - Get user profile
  .get('/', ({ userId }) => ProfileModel.getUserProfile(userId))

  // PATCH /api/profile - Update user profile
  .patch('/', ({ userId, body }) =>
    ProfileModel.updateUserProfile(userId, body as any)
  )

  // POST /api/profile/password - Update password
  .post('/password', async ({ userId, body }) => {
    const { currentPassword, newPassword } = body as {
      currentPassword: string;
      newPassword: string;
    };
    const success = await ProfileModel.updatePassword(userId, currentPassword, newPassword);
    if (!success) {
      return { success: false, message: 'Failed to update password' };
    }
    return { success: true, message: 'Password updated successfully' };
  });
