/**
 * Tests for calendarRoutes schemas. Covers the two POST routes;
 * the manual `if (!join_code)` validation in /join collapses into
 * the schema, which we prove by asserting the malformed-body case.
 */
import { describe, test, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { errorHandler } from '../../plugins/errorHandler';
import { calendarRoutes } from '../calendarRoutes';
import { AuthService } from '../../services/authService';

const TOKEN = AuthService.generateToken('00000000-0000-0000-0000-000000000000');

const app = new Elysia()
  .use(errorHandler)
  .use(calendarRoutes);

const authed = (path: string, init: RequestInit = {}): Request =>
  new Request(`http://localhost${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${TOKEN}`,
      ...(init.headers as Record<string, string> | undefined),
    },
  });

describe('calendarRoutes — POST /api/calendars', () => {
  test('empty body → 400', async () => {
    const res = await app.handle(authed('/api/calendars', {
      method: 'POST',
      body: JSON.stringify({}),
    }));
    expect(res.status).toBe(400);
  });

  test('calendar_name wrong type → 400', async () => {
    const res = await app.handle(authed('/api/calendars', {
      method: 'POST',
      body: JSON.stringify({ calendar_name: 12345 }),
    }));
    expect(res.status).toBe(400);
  });
});

describe('calendarRoutes — POST /api/calendars/join', () => {
  test('empty body → 400 (schema replaces the old manual `if (!join_code)`)', async () => {
    const res = await app.handle(authed('/api/calendars/join', {
      method: 'POST',
      body: JSON.stringify({}),
    }));
    expect(res.status).toBe(400);
  });

  test('empty join_code string → 400 (minLength: 1)', async () => {
    const res = await app.handle(authed('/api/calendars/join', {
      method: 'POST',
      body: JSON.stringify({ join_code: '' }),
    }));
    expect(res.status).toBe(400);
  });

  test('join_code wrong type → 400', async () => {
    const res = await app.handle(authed('/api/calendars/join', {
      method: 'POST',
      body: JSON.stringify({ join_code: 12345 }),
    }));
    expect(res.status).toBe(400);
  });
});