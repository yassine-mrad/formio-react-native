/**
 * Errors index - export all error classes and utilities
 * 
 * @module errors
 */

export {
  FormioError,
  InvalidSchemaError,
  MissingComponentError,
  ComponentRenderError,
  SubmissionError,
  isFormioError,
  isValidationError,
} from './FormioError';

export { ErrorBoundary } from './ErrorBoundary';
export type { ErrorBoundaryProps } from './ErrorBoundary';

export {
  handleError,
  normalizeError,
  createValidationError,
  isError,
  isFormioError as isFormioErrorUtil,
  getErrorMessage,
} from './errorUtils';
