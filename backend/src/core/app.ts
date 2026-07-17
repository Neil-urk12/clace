import { Elysia, type ElysiaAdapter } from 'elysia';
import { cors } from '@elysiajs/cors';
import { authRoutes, authProtectedRoutes } from '../routes/authRoutes';
import { eventRoutes } from '../routes/eventRoutes';
import { calendarRoutes } from '../routes/calendarRoutes';
import { profileRoutes } from '../routes/profileRoutes';
import { successWrap } from '../plugins/successWrap';
import { errorHandler } from '../plugins/errorHandler';
import { getConfig, type Env } from './config';
import { getBunDb, createWorkersDb } from './db';
import { InMemoryTokenBlacklist, KvTokenBlacklist, type TokenBlacklist } from '../services/tokenBlacklist';
import { DrizzleUserStore } from '../services/drizzleUserStore';
import type { UserStore } from '../models/UserModel';

/**
 * Create the Elysia app with dependency injection.
 *
 * `db` and `config` are injected into every request context via a single
 * `.derive()` at the top of the chain. All routes composed after it have
 * access to these properties.
 */
export const createApp = (env?: Env | Record<string, string>, adapter?: ElysiaAdapter, customUserStore?: UserStore) => {
  const config = getConfig(env);

  // Token blacklist: KV-backed for Workers (cross-isolate), in-memory for Bun.
  const blacklist: TokenBlacklist = (env as Env)?.TOKEN_BLACKLIST
    ? new KvTokenBlacklist((env as Env).TOKEN_BLACKLIST!, config.JWT_EXPIRES_IN)
    : new InMemoryTokenBlacklist();

  return new Elysia({ adapter })
    // Inject db, config, and blacklist into every request context.
    // Workers: fresh Neon HTTP db per-request (stateless HTTP).
    // Bun: lazy TCP singleton (pg pool).
    .derive(async () => {
      const db = env
        ? await createWorkersDb(config.DATABASE_URL)
        : getBunDb(config.DATABASE_URL);

      const userStore = customUserStore ?? new DrizzleUserStore(db);

      return { db, config, blacklist, userStore };
    })
    .use(cors())
    .use(successWrap)
    .use(errorHandler)
    .use(authRoutes)
    .use(authProtectedRoutes)
    .use(eventRoutes)
    .use(calendarRoutes)
    .use(profileRoutes)
    .get('/', () => 'Backend is running');
};

/** Default app for Bun dev (reads process.env). */
export const app = createApp();
