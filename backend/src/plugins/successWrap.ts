import type { Elysia } from 'elysia';

/**
 * Elysia onAfterHandle plugin. Wraps successful responses as
 * {success: true, data: <response>} unless the response is already
 * shaped (has a `success` key), null/undefined, or not a plain object.
 */
export const successWrap = (app: Elysia) =>
  app.onAfterHandle(({ response, set }) => {
    if (response === null || response === undefined) return;
    if (typeof response !== 'object') return;
    if ('success' in response) return;
    if (set.status !== 200 && set.status !== 201) return;

    return { success: true, data: response };
  });
