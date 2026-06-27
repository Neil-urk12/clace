// backend/src/core/config.ts

export interface Config {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: number;
}

/**
 * Load config from environment.
 * In Workers, pass env bindings explicitly.
 * In Bun, reads process.env directly.
 */
export function getConfig(env?: Record<string, string>): Config {
  const source = env ?? process.env;

  const DATABASE_URL = source.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const JWT_SECRET = source.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  const JWT_EXPIRES_IN = source.JWT_EXPIRES_IN
    ? parseInt(source.JWT_EXPIRES_IN, 10)
    : 86400; // 24 hours in seconds

  return { DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN };
}