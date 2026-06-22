/**
 * Domain error classes for the API client.
 *
 * The frontend reconstructs these from HTTP status codes — the backend's
 * class names don't travel over the wire, only `{success: false, message}`
 * with a status code does. The hierarchy mirrors the backend's so consumers
 * can pattern-match by intent (e.g. `instanceof UnauthorizedError`) instead
 * of magic numbers.
 */

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends DomainError {
  constructor(message = 'Not found') {
    super(message, 404);
  }
}

export class ConflictError extends DomainError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

const STATUS_TO_ERROR: Record<number, typeof DomainError> = {
  400: ValidationError,
  401: UnauthorizedError,
  403: ForbiddenError,
  404: NotFoundError,
  409: ConflictError,
};

/** Build the right DomainError subclass for a given HTTP status. */
export const errorFromStatus = (status: number, message: string): DomainError => {
  const ErrClass = STATUS_TO_ERROR[status] ?? DomainError;
  // Subclasses hardcode their status; base DomainError takes status as 2nd arg.
  return new ErrClass(message, status);
};