// backend/src/services/authService.ts

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { UserModel, CreateUserData, UserResponse } from '../models/User';
import { ConflictError, UnauthorizedError } from '../lib/errors';
import { getConfig } from '../core/config';

interface TokenPayload extends JWTPayload {
  userId: string;
}

function getJwtSecret(): Uint8Array {
  const config = getConfig();
  return new TextEncoder().encode(config.JWT_SECRET);
}

// In-memory token blacklist
// In a prod env, this should be replaced with a Redis cache or db
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
  static async generateToken(userId: string): Promise<string> {
    const config = getConfig();
    const secret = getJwtSecret();

    return new SignJWT({ userId } as TokenPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${config.JWT_EXPIRES_IN}s`)
      .sign(secret);
  }

  static async verifyToken(token: string): Promise<TokenPayload | null> {
    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      return null;
    }

    try {
      const { payload } = await jwtVerify(token, getJwtSecret());
      return payload as TokenPayload;
    } catch {
      return null;
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await UserModel.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await UserModel.validatePassword(user, credentials.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = await AuthService.generateToken(user.id);
    const userResponse = UserModel.toResponse(user);

    return {
      token,
      user: userResponse
    };
  }

  static async logout(token: string): Promise<{ success: boolean }> {
    try {
      const { payload } = await jwtVerify(token, getJwtSecret());

      // Add token to blacklist
      tokenBlacklist.add(token);

      // If we have expiry info, we can set up automatic cleanup
      if (payload.exp) {
        const timeUntilExpiry = payload.exp * 1000 - Date.now();
        if (timeUntilExpiry > 0) {
          setTimeout(() => {
            tokenBlacklist.delete(token);
          }, timeUntilExpiry);
        }
      }

      return { success: true };
    } catch {
      // If token is already invalid, just return success
      return { success: true };
    }
  }

  static async getUserById(userId: string) {
    const user = await UserModel.findById(userId);
    return user ? UserModel.toResponse(user) : null;
  }

  static async register(userData: CreateUserData): Promise<AuthResponse> {
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const user = await UserModel.create(userData);
    const token = await AuthService.generateToken(user.id);

    return {
      token,
      user: UserModel.toResponse(user)
    };
  }
}
