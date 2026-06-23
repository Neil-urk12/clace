import type { Elysia } from 'elysia';
import { DomainError } from '../lib/errors';

const STATUS_BY_NAME: Record<string, number> = {
  NotFoundError: 404,
  ValidationError: 400,
  UnauthorizedError: 401,
  ForbiddenError: 403,
  ConflictError: 409,
};

const isDomainError = (err: unknown): err is DomainError =>
  err instanceof DomainError;

/**
 * Elysia onError plugin. Maps domain error classes to HTTP status codes
 * and the {success: false, message} response shape. Routes Elysia's
 * built-in schema validation errors to 400 with field-level details
 * so a malformed body never surfaces as a 500. Falls back to 500 for
 * anything else, with a generic message (the real error is logged).
 */
export const errorHandler = (app: Elysia) =>
  app.onError(({ code, error, set }) => {
    console.error(`[${code}]`, error);

    if (isDomainError(error)) {
      const status = STATUS_BY_NAME[error.name] ?? 500;
      set.status = status;
      return {
        success: false,
        message: error.message,
      };
    }

    if (code === 'VALIDATION') {
      set.status = 400;
      const e = error as any;
      return {
        success: false,
        message: 'Validation failed',
        errors: e.errors ?? e.message,
      };
    }

    set.status = 500;
    return {
      success: false,
      message: 'Internal server error',
    };
  });