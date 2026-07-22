import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import type { Config } from '../core/config';
import type { TokenBlacklist } from './tokenBlacklist';

interface TokenPayload extends JWTPayload {
  userId: string;
}

function getJwtSecret(config: Config): Uint8Array {
  return new TextEncoder().encode(config.JWT_SECRET);
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

  static async logout(token: string, config: Config, blacklist: TokenBlacklist): Promise<{ success: boolean }> {
    try {
      await jwtVerify(token, getJwtSecret(config));
      await blacklist.add(token);
      return { success: true };
    } catch {
      return { success: true };
    }
  }
}
