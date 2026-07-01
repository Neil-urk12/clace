// backend/src/services/tokenBlacklist.ts
//
// Pluggable token blacklist interface.
// - InMemoryTokenBlacklist: for Bun dev / single-process use.
// - KvTokenBlacklist: for Cloudflare Workers (cross-isolate via KV).

/**
 * Abstraction for revoked-token storage.
 *
 * In Bun, an in-memory Set works because there is a single long-lived process.
 * In Workers, each request may land on a different isolate, so we need
 * an external store (Cloudflare KV, Durable Objects, or a database).
 */
export interface TokenBlacklist {
  /** Revoke a token. */
  add(token: string): void | Promise<void>;
  /** Check whether a token has been revoked. */
  has(token: string): boolean | Promise<boolean>;
  /** Remove a token from the blacklist (e.g. after expiry). */
  delete(token: string): void | Promise<void>;
}

// ---------------------------------------------------------------------------
// In-memory implementation (Bun / single-process)
// ---------------------------------------------------------------------------

export class InMemoryTokenBlacklist implements TokenBlacklist {
  private blacklist = new Set<string>();

  add(token: string): void {
    this.blacklist.add(token);
  }

  has(token: string): boolean {
    return this.blacklist.has(token);
  }

  delete(token: string): void {
    this.blacklist.delete(token);
  }
}

// ---------------------------------------------------------------------------
// Cloudflare KV implementation (Workers)
// ---------------------------------------------------------------------------

/**
 * KV-backed blacklist for Cloudflare Workers.
 *
 * Uses KV's built-in TTL (`expirationTtl`) so entries auto-expire —
 * no `setTimeout` cleanup required.
 *
 * Requires a KV namespace binding named `TOKEN_BLACKLIST` in wrangler.toml:
 *
 *   [[kv_namespaces]]
 *   binding = "TOKEN_BLACKLIST"
 *   id = "<your-kv-namespace-id>"
 */
export class KvTokenBlacklist implements TokenBlacklist {
  private kv: KVNamespace;
  private ttlSeconds: number;

  constructor(kv: KVNamespace, jwtExpiresIn: number) {
    this.kv = kv;
    this.ttlSeconds = jwtExpiresIn;
  }

  /** Store token with a TTL matching JWT expiry. */
  async add(token: string): Promise<void> {
    await this.kv.put(`bl:${token}`, '1', { expirationTtl: this.ttlSeconds });
  }

  async has(token: string): Promise<boolean> {
    const value = await this.kv.get(`bl:${token}`);
    return value !== null;
  }

  async delete(token: string): Promise<void> {
    await this.kv.delete(`bl:${token}`);
  }
}
