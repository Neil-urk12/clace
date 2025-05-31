import { AuthService, LoginCredentials } from '../services/authService';
import { CreateUserData } from '../models/User';

export class AuthController {
  static async login(body: LoginCredentials) {
    try {
      const result = await AuthService.login(body);
      return {
        success: true,
        ...result
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  static async register(body: CreateUserData) {
    try {
      const result = await AuthService.register(body);
      return {
        success: true,
        ...result
      };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }
}
