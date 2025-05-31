import { Elysia } from 'elysia';
import { AuthController } from '../controllers/authController';

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .post('/login', async ({ body, set }) => {
    try {
      console.log('Login attempt with body:', body);
      const result = await AuthController.login(body as any);
      return result;
    } catch (error: any) {
      console.error('Login error:', error);
      set.status = 400;
      return { 
        success: false, 
        message: error.message || 'Login failed'
      };
    }
  })
  .post('/register', async ({ body, set }) => {
    try {
      console.log('Register attempt with body:', body);
      const result = await AuthController.register(body as any);
      return result;
    } catch (error: any) {
      console.error('Register error:', error);
      set.status = 400;
      return { 
        success: false, 
        message: error.message || 'Registration failed'
      };
    }
  });
