import { describe, it, expect, beforeEach, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { createApiClient } from '../client';
import { DomainError, NotFoundError, UnauthorizedError, ValidationError } from '../errors';

describe('apiClient interceptors', () => {
  let mock: MockAdapter;
  let getToken: ReturnType<typeof vi.fn>;
  let client: ReturnType<typeof createApiClient>;

  beforeEach(() => {
    getToken = vi.fn().mockReturnValue(null);
    client = createApiClient({ getToken });
    mock = new MockAdapter(client.instance);
  });

  it('attaches Bearer when token is present, omits when absent', async () => {
    let seenAuth: string | undefined;
    mock.onGet('/me').reply((config) => {
      seenAuth = config.headers?.Authorization as string | undefined;
      return [200, { success: true, data: null }];
    });
    await client.instance.get('/me');
    expect(seenAuth).toBeUndefined();
    getToken.mockReturnValue('tok');
    await client.instance.get('/me');
    expect(seenAuth).toBe('Bearer tok');
  });

  it('unwraps {success: true, data}', async () => {
    mock.onGet('/events').reply(200, { success: true, data: [{ id: 'e1' }] });
    const res = await client.instance.get('/events');
    expect(res.data).toEqual([{ id: 'e1' }]);
  });

  it.each([
    [404, NotFoundError],
    [401, UnauthorizedError],
    [400, ValidationError],
  ])('maps status %i to %s', async (status, ErrClass) => {
    mock.onGet('/x').reply(status, { success: false, message: 'm' });
    await expect(client.instance.get('/x')).rejects.toThrow(ErrClass);
  });

  it('preserves backend message and status on thrown DomainError', async () => {
    mock.onGet('/x').reply(404, { success: false, message: 'gone' });
    const err = await client.instance.get('/x').catch((e) => e);
    expect(err).toBeInstanceOf(DomainError);
    expect((err as DomainError).message).toBe('gone');
    expect((err as DomainError).status).toBe(404);
  });

  it('exposed methods return unwrapped data directly', async () => {
    mock.onGet('/u').reply(200, { success: true, data: { id: 'u1' } });
    const data = await client.get<{ id: string }>('/u');
    expect(data).toEqual({ id: 'u1' });
  });
});