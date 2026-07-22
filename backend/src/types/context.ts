import type { AppDb } from '../core/db';
import type { Config } from '../core/config';
import type { TokenBlacklist } from '../services/tokenBlacklist';
import type { UserStore } from '../models/UserModel';

/**
 * Base typed request context available to all route handlers.
 *
 * Properties injected via Elysia .derive() in app.ts:
 * - `db`, `config`
 *
 * Standard Elysia context properties (body, params, query, headers, set)
 * are typed loosely since they vary per route schema.
 */
export interface RouteContext {
  db: AppDb;
  config: Config;
  blacklist: TokenBlacklist;
  userStore: UserStore;
  set: { status: number; headers: Record<string, string> };
  headers: Record<string, string | undefined>;
  body: any;
  params: Record<string, string>;
  query: Record<string, unknown>;
}

/**
 * Extended context for routes protected by authMiddleware.
 * Adds `userId` derived from the JWT token.
 */
export interface ProtectedRouteContext extends RouteContext {
  userId: string;
}
