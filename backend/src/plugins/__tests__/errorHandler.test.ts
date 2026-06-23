/**
 * Tests for the errorHandler plugin. Two responsibilities:
 *   1. Map DomainError subclasses to their HTTP status codes with
 *      the {success: false, message} shape.
 *   2. (NEW) Map Elysia schema validation errors to 400 with
 *      {success: false, message, errors} — preserves field-level details
 *      from the validator so clients can show form-level messages.
 *
 * Each test boots a minimal Elysia app — no DB, no env vars.
 */
import { describe, test, expect } from 'bun:test';
import { Elysia, t } from 'elysia';
import { errorHandler } from '../errorHandler';
import { NotFoundError, UnauthorizedError } from '../../lib/errors';

const schemaApp = new Elysia()
  .use(errorHandler)
  .post('/echo', ({ body }) => body, {
    body: t.Object({
      name: t.String(),
      age: t.Number(),
    }),
  });

const domainApp = new Elysia()
  .use(errorHandler)
  .get('/not-found', () => {
    throw new NotFoundError('Widget not found');
  })
  .get('/unauthorized', () => {
    throw new UnauthorizedError('No token');
  });

describe('errorHandler — DomainError mapping', () => {
  test('NotFoundError → 404 with {success: false, message}', async () => {
    const res = await domainApp.handle(new Request('http://localhost/not-found'));
    expect(res.status).toBe(404);
    const json = (await res.json()) as { success: boolean; message: string };
    expect(json.success).toBe(false);
    expect(json.message).toBe('Widget not found');
  });

  test('UnauthorizedError → 401', async () => {
    const res = await domainApp.handle(new Request('http://localhost/unauthorized'));
    expect(res.status).toBe(401);
    const json = (await res.json()) as { success: boolean; message: string };
    expect(json.success).toBe(false);
  });
});

describe('errorHandler — VALIDATION branch', () => {
  test('missing required field → 400 with structured shape', async () => {
    const res = await schemaApp.handle(
      new Request('http://localhost/echo', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'Alice' }), // missing age
      }),
    );
    expect(res.status).toBe(400);
    const json = (await res.json()) as {
      success: boolean;
      message: string;
      errors: unknown;
    };
    expect(json.success).toBe(false);
    expect(typeof json.message).toBe('string');
    expect(json.errors).toBeDefined();
  });

  test('wrong type → 400', async () => {
    const res = await schemaApp.handle(
      new Request('http://localhost/echo', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'Alice', age: 'not-a-number' }),
      }),
    );
    expect(res.status).toBe(400);
  });

  test('valid body → 200 (handler runs)', async () => {
    const res = await schemaApp.handle(
      new Request('http://localhost/echo', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'Alice', age: 30 }),
      }),
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as { name: string; age: number };
    expect(json.name).toBe('Alice');
    expect(json.age).toBe(30);
  });
});