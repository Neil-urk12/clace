/**
 * Preload before tests run. Sets required env vars so that importing
 * route files (which transitively import authService, db_config, etc.)
 * does not throw.
 */
process.env.JWT_SECRET ??= 'test-secret';
process.env.JWT_EXPIRES_IN ??= '86400';
process.env.DB_HOSTNAME ??= 'localhost';
process.env.DB_USERNAME ??= 'test';
process.env.DB_PASSWORD ??= 'test';
process.env.DB_DATABASE ??= 'test';
process.env.DB_PORT ??= '3306';
process.env.DB_SSLMODE ??= 'disable';