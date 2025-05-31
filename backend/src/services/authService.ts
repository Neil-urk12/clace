import * as jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { UserModel, CreateUserData, UserResponse } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
// Convert time string to seconds for JWT library
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ? process.env.JWT_EXPIRES_IN : 86400; // 24 hours in seconds

// In-memory token blacklist
// In a production environment, this should be replaced with a Redis cache or database
const tokenBlacklist = new Set<string>();

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export class AuthService {
  static generateToken(userId: string): string {
    const payload = { userId };
    // Using numeric value for expiresIn to avoid type issues
    return jwt.sign(payload, JWT_SECRET, { expiresIn: Number(JWT_EXPIRES_IN) });
  }

  static verifyToken(token: string): { userId: string } | null {
    try {
      // Check if token is blacklisted
      if (tokenBlacklist.has(token)) {
        return null;
      }
      
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await UserModel.findByEmail(credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await UserModel.validatePassword(user, credentials.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user.user_id);
    const userResponse = UserModel.toResponse(user);

    return {
      token,
      user: userResponse
    };
  }

  static async logout(token: string): Promise<{ success: boolean }> {
    try {
      // Verify the token is valid before blacklisting
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      
      // Add token to blacklist
      tokenBlacklist.add(token);
      
      // If we have expiry information, we can set up automatic cleanup
      if (decoded.exp) {
        const timeUntilExpiry = decoded.exp * 1000 - Date.now();
        if (timeUntilExpiry > 0) {
          // Remove from blacklist after token expires to prevent memory leaks
          setTimeout(() => {
            tokenBlacklist.delete(token);
          }, timeUntilExpiry);
        }
      }
      
      return { success: true };
    } catch (error) {
      // If token is already invalid, just return success
      return { success: true };
    }
  }

  static async register(userData: CreateUserData): Promise<AuthResponse> {
    const existingUser = await UserModel.findByEmail(userData.email);
    
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await UserModel.create(userData);
    const token = this.generateToken(user.user_id);

    return {
      token,
      user
    };
  }
}