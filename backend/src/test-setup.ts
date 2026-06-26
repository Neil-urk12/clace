/**
 * Preload before tests run. Sets required env vars so that importing
 * route files (which transitively import drizzle, etc.) does not throw.
 */
process.env.JWT_SECRET ??= 'test-secret';
process.env.JWT_EXPIRES_IN ??= '86400';
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
