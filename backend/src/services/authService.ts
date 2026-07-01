// backend/src/services/authService.ts

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { UserModel, CreateUserData, UserResponse } from '../models/User';
import { ConflictError, UnauthorizedError } from '../lib/errors';
import type { Config } from '../core/config';
import type { AppDb } from '../core/db';
import type { TokenBlacklist } from './tokenBlacklist';

interface TokenPayload extends JWTPayload {
  userId: string;
}

function getJwtSecret(config: Config): Uint8Array {
  return new TextEncoder().encode(config.JWT_SECRET);
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export class AuthService {
  static async generateToken(userId: string, config: Config): Promise<string> {
    const secret = getJwtSecret(config);

    return new SignJWT({ userId } as TokenPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${config.JWT_EXPIRES_IN}s`)
      .sign(secret);
  }

  static async verifyToken(token: string, config: Config, blacklist: TokenBlacklist): Promise<TokenPayload | null> {
    // Check if token has been revoked
    if (await blacklist.has(token)) {
      return null;
    }

    try {
      const { payload } = await jwtVerify(token, getJwtSecret(config));
      return payload as TokenPayload;
    } catch {
      return null;
    }
  }

  static async login(db: AppDb, credentials: LoginCredentials, config: Config): Promise<AuthResponse> {
    const user = await UserModel.findByEmail(db, credentials.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await UserModel.validatePassword(user, credentials.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = await AuthService.generateToken(user.id, config);
    const userResponse = UserModel.toResponse(user);

    return {
      token,
      user: userResponse
    };
  }

  static async logout(token: string, config: Config, blacklist: TokenBlacklist): Promise<{ success: boolean }> {
    try {
      await jwtVerify(token, getJwtSecret(config));

      // Revoke the token. KV-backed blacklists use built-in TTL;
      // in-memory sets grow by one entry per logout (negligible).
      await blacklist.add(token);

      return { success: true };
    } catch {
      // If token is already invalid, just return success
      return { success: true };
    }
  }

  static async getUserById(db: AppDb, userId: string) {
    const user = await UserModel.findById(db, userId);
    return user ? UserModel.toResponse(user) : null;
  }

  static async register(db: AppDb, userData: CreateUserData, config: Config): Promise<AuthResponse> {
    const existingUser = await UserModel.findByEmail(db, userData.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const user = await UserModel.create(db, userData);
    const token = await AuthService.generateToken(user.user_id, config);

    return {
      token,
      user
    };
  }
}
