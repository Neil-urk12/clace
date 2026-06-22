/**
 * Domain error classes. Each subclass maps to a single HTTP status code
 * via the errorHandler plugin, so routes never pattern-match on
 * error.message strings and services can throw by intent.
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends DomainError {}
export class ValidationError extends DomainError {}
export class UnauthorizedError extends DomainError {}
export class ForbiddenError extends DomainError {}
export class ConflictError extends DomainError {}
