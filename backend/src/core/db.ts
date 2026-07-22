// backend/src/core/db.ts
//
// Unified DB factory for both Bun (pg TCP) and Workers (Neon HTTP) runtimes.

import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import * as schema from '../config/schema';

// ---------- Type ----------

/** The drizzle instance type used throughout the app. */
export type AppDb = ReturnType<typeof drizzleNode<typeof schema>>;

// ---------- Bun singleton (TCP via pg) ----------

let _bunDb: AppDb | null = null;

/**
 * Lazy singleton for the Bun runtime.
 * Uses the pg TCP driver.
 */
export function getBunDb(databaseUrl: string): AppDb {
  if (!_bunDb) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require('pg') as typeof import('pg');
    const pool = new Pool({ connectionString: databaseUrl });
    _bunDb = drizzleNode(pool, { schema });
  }
  return _bunDb;
}

// ---------- Workers factory (HTTP via Neon) ----------

/**
 * Create a drizzle instance for the Cloudflare Workers runtime.
 * Uses the Neon serverless HTTP driver (no TCP sockets).
 */
export async function createWorkersDb(databaseUrl: string): Promise<AppDb> {
  const { neon } = await import('@neondatabase/serverless');
  const { drizzle: drizzleNeon } = await import('drizzle-orm/neon-http');

  const sql = neon(databaseUrl);
  // neon-http returns NeonHttpDatabase which is API-compatible with NodePgDatabase
  // for all operations our models use (select, insert, update, delete, transaction).
  return drizzleNeon(sql, { schema }) as unknown as AppDb;
}

// ---------- Schema re-export ----------

export { schema };
