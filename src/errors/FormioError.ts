/**
 * Custom error classes for Formio library
 * 
 * @module errors
 */

/**
 * Base error class for all Formio errors
 */
export class FormioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormioError';
    Object.setPrototypeOf(this, FormioError.prototype);
  }
}

/**
 * Thrown when form schema is invalid or malformed
 */
export class InvalidSchemaError extends FormioError {
  constructor(message: string, public readonly schema?: any) {
    super(message);
    this.name = 'InvalidSchemaError';
    Object.setPrototypeOf(this, InvalidSchemaError.prototype);
  }
}

/**
 * Thrown when a required component is missing
 */
export class MissingComponentError extends FormioError {
  constructor(public readonly componentType: string) {
    super(`Component type "${componentType}" is not registered`);
    this.name = 'MissingComponentError';
    Object.setPrototypeOf(this, MissingComponentError.prototype);
  }
}

/**
 * Thrown when component rendering fails
 */
export class ComponentRenderError extends FormioError {
  constructor(
    message: string,
    public readonly componentKey: string,
    public readonly originalError: Error
  ) {
    super(message);
    this.name = 'ComponentRenderError';
    Object.setPrototypeOf(this, ComponentRenderError.prototype);
  }
}

/**
 * Thrown when validation fails
 */
export class ValidationError extends FormioError {
  constructor(
    public readonly field: string,
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Thrown when form submission fails
 */
export class SubmissionError extends FormioError {
  constructor(
    message: string,
    public readonly errors?: ValidationError[]
  ) {
    super(message);
    this.name = 'SubmissionError';
    Object.setPrototypeOf(this, SubmissionError.prototype);
  }
}

/**
 * Type guard for FormioError
 */
export function isFormioError(error: unknown): error is FormioError {
  return error instanceof FormioError;
}

/**
 * Type guard for validation errors
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}
