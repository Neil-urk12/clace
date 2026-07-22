// backend/src/config/drizzle.ts
//
// Bun-only DB singleton. Used by seed.ts and Bun dev mode.
// Models should NOT import from here — they receive `db` via Elysia context.

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
export { pool };
