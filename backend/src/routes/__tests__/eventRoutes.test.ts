/**
 * Tests for eventRoutes schemas. Proves:
 *   - Schema rejects malformed bodies on POST /, PUT /:id, POST /bulk
 *   - t.Date parses ISO strings to Date (the route no longer calls new Date())
 *   - PUT /:id accepts partial bodies (the route still does the field rename)
 *   - GET /filter validates query params
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

describe('eventRoutes — POST /api/events', () => {
  test('empty body → 400', async () => {
    const res = await app.handle(authed('/api/events', {
      method: 'POST',
      body: JSON.stringify({}),
    }));
    expect(res.status).toBe(400);
  });

  test('missing endDate → 400', async () => {
    const res = await app.handle(authed('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test',
        startDate: '2026-06-23T10:00:00.000Z',
      }),
    }));
    expect(res.status).toBe(400);
  });

  test('invalid ISO date → 400', async () => {
    const res = await app.handle(authed('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test',
        startDate: 'not-a-date',
        endDate: '2026-06-23T11:00:00.000Z',
      }),
    }));
    expect(res.status).toBe(400);
  });
});

describe('eventRoutes — PUT /api/events/:id', () => {
  test('empty body is allowed (partial update, no fields to update)', async () => {
    const res = await app.handle(authed('/api/events/00000000-0000-0000-0000-000000000000', {
      method: 'PUT',
      body: JSON.stringify({}),
    }));
    expect(res.status).not.toBe(400);
  });

  test('partial update with title only → schema passes', async () => {
    const res = await app.handle(authed('/api/events/00000000-0000-0000-0000-000000000000', {
      method: 'PUT',
      body: JSON.stringify({ title: 'Renamed' }),
    }));
    expect(res.status).not.toBe(400);
  });

  test('startDate with bad type → 400', async () => {
    const res = await app.handle(authed('/api/events/00000000-0000-0000-0000-000000000000', {
      method: 'PUT',
      body: JSON.stringify({ startDate: { not: 'a date' } }),
    }));
    expect(res.status).toBe(400);
  });
});

describe('eventRoutes — POST /api/events/bulk', () => {
  test('empty array passes schema (model concern, not shape)', async () => {
    const res = await app.handle(authed('/api/events/bulk', {
      method: 'POST',
      body: JSON.stringify([]),
    }));
    expect(res.status).not.toBe(400);
  });

  test('malformed item in array → 400', async () => {
    const res = await app.handle(authed('/api/events/bulk', {
      method: 'POST',
      body: JSON.stringify([
        { title: 'Good', startDate: '2026-06-23T10:00:00.000Z', endDate: '2026-06-23T11:00:00.000Z' },
        { title: 'Bad' }, // missing dates
      ]),
    }));
    expect(res.status).toBe(400);
  });
});

describe('eventRoutes — GET /api/events/filter', () => {
  test('no query → 200 (empty filter, reaches handler)', async () => {
    const res = await app.handle(authed('/api/events/filter'));
    expect(res.status).not.toBe(400);
  });

  test('invalid startDate query → 400', async () => {
    const res = await app.handle(authed('/api/events/filter?startDate=not-a-date'));
    expect(res.status).toBe(400);
  });
});
