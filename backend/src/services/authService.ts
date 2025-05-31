import jwt from 'jsonwebtoken';
import { UserModel, CreateUserData, UserResponse } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

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
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
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
