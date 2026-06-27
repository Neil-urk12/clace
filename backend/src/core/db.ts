import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../config/schema';
import { getConfig } from './config';

export type DbInstance = ReturnType<typeof createDb>;

function createDb(databaseUrl: string) {
  // Use pg for Bun (TCP connections)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require('pg') as typeof import('pg');
  const pool = new Pool({ connectionString: databaseUrl });
  return { db: drizzle(pool, { schema }), pool };
}

// Lazy singleton for Bun runtime
let _db: DbInstance | null = null;

/**
 * Get DB instance for Bun runtime.
 * Uses pg TCP driver.
 */
export function getDb(): DbInstance {
  if (!_db) {
    const config = getConfig();
    _db = createDb(config.DATABASE_URL);
  }
  return _db;
}

/**
 * Get DB instance for Workers runtime.
 * Uses Neon serverless HTTP driver.
 */
export async function getWorkersDb(databaseUrl: string) {
  const { neon } = await import('@neondatabase/serverless');
  const { drizzle: drizzleNeon } = await import('drizzle-orm/neon-http');

  const sql = neon(databaseUrl);
  return drizzleNeon(sql, { schema });
}

// Re-export schema for convenience
export { schema };
