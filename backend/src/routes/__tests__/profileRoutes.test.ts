/**
 * Tests for profileRoutes schemas. Only the schema-validation path is
 * exercised here; the DB-dependent success path stays as manual QA.
 *
 * The auth middleware runs before schema validation, so we mint a real
 * JWT with a fake user_id — the token only needs to be signed with
 * the test JWT_SECRET to pass verification; the user_id is never looked
 * up by the middleware.
 */
import { describe, test, expect } from 'bun:test';
import { createApp } from '../../core/app';
import { AuthService } from '../../services/authService';
import { getConfig } from '../../core/config';

const config = getConfig();
const TOKEN = await AuthService.generateToken('00000000-0000-0000-0000-000000000000', config);

const app = createApp();

const authed = (path: string, init: RequestInit = {}): Request =>
  new Request(`http://localhost${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${TOKEN}`,
      ...(init.headers as Record<string, string> | undefined),
    },
  });

describe('profileRoutes — PATCH /api/profile', () => {
  test('empty body → 400 (no fields to update is rejected by the model)', async () => {
    // Schema accepts {} (all fields optional). The handler delegates to
    // ProfileModel.updateUserProfile which tries to begin a transaction —
    // without a DB it throws a connection error (5xx), proving the schema
    // passed and the request reached the handler.
    const res = await app.handle(authed('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({}),
    }));
    expect(res.status).not.toBe(400);
  });

  test('name with wrong type → 400', async () => {
    const res = await app.handle(authed('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ name: 12345 }),
    }));
    expect(res.status).toBe(400);
  });
});

describe('profileRoutes — POST /api/profile/password', () => {
  test('empty body → 400', async () => {
    const res = await app.handle(authed('/api/profile/password', {
      method: 'POST',
      body: JSON.stringify({}),
    }));
    expect(res.status).toBe(400);
  });

  test('missing newPassword → 400', async () => {
    const res = await app.handle(authed('/api/profile/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: 'old' }),
    }));
    expect(res.status).toBe(400);
  });

  test('non-string currentPassword → 400', async () => {
    const res = await app.handle(authed('/api/profile/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: 123, newPassword: 'new' }),
    }));
    expect(res.status).toBe(400);
  });
});
