/**
 * Tests for authRoutes schemas. The DB-free cases prove the schema
 * rejects bad bodies before any service is hit; success-path coverage
 * stays as manual QA (no DB).
 */
import { describe, test, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { errorHandler } from '../../plugins/errorHandler';
import { authRoutes } from '../authRoutes';

const app = new Elysia()
  .use(errorHandler)
  .use(authRoutes);

describe('authRoutes — POST /api/auth/login', () => {
  test('empty body → 400', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { success: boolean };
    expect(json.success).toBe(false);
  });

  test('missing password → 400', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'alice@example.com' }),
    }));
    expect(res.status).toBe(400);
  });

  test('non-string email → 400', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 123, password: 'x' }),
    }));
    expect(res.status).toBe(400);
  });
});

describe('authRoutes — POST /api/auth/register', () => {
  test('empty body → 400', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    }));
    expect(res.status).toBe(400);
  });

  test('missing full_name → 400', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'alice@example.com', password: 'secret' }),
    }));
    expect(res.status).toBe(400);
  });

  test('omitting is_class_president is allowed (defaults to false)', async () => {
    // The schema validates; the service path is exercised by manual QA
    // because it requires a live DB. This test confirms the schema accepts
    // a body without the optional field — it will fail downstream with
    // a 5xx from the service, not a 400 from the schema.
    const res = await app.handle(new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ full_name: 'Alice', email: 'alice@example.com', password: 'secret' }),
    }));
    // Schema passed (we did not get 400) — service is unreachable in test, so 5xx
    expect(res.status).not.toBe(400);
  });
});