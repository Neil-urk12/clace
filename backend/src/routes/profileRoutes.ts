import { Elysia } from 'elysia';
import { ProfileController } from '../controllers/profileController';
import { authMiddleware, AuthContext } from '../middlewares/authMiddleware';

// Create a protected route group with auth middleware
const protectedRoutes = new Elysia()
  .use(authMiddleware)
  
  // User Profile endpoints
  .get('/', async ({ userId, set }) => {
    try {
      // Pass userId directly from auth middleware
      const result = await ProfileController.getUserProfile(userId);
      return result;
    } catch (error: any) {
      console.error('Get profile error:', error);
      set.status = 500;
      return { 
        success: false, 
        message: error.message || 'Server error'
      };
    }
  })
  
  .patch('/', async ({ userId, body, set }) => {
    try {
      const result = await ProfileController.updateUserProfile(userId, body as any);
      return result;
    } catch (error: any) {
      console.error('Update profile error:', error);
      set.status = 500;
      return { 
        success: false, 
        message: error.message || 'Server error'
      };
    }
  })
  

  
  // Password update endpoint
  .post('/password', async ({ userId, body, set }) => {
    try {
      const result = await ProfileController.updatePassword(userId, body as any);
      return result;
    } catch (error: any) {
      console.error('Update password error:', error);
      set.status = 500;
      return { 
        success: false, 
        message: error.message || 'Server error'
      };
    }
  });

// Export the main profile routes with prefix
export const profileRoutes = new Elysia({ prefix: '/api/profile' })
  .use(protectedRoutes);
