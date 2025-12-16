/**
 * Error handling utilities
 * 
 * @module errors/errorUtils
 */

import { Logger } from '../utils/logger';
import { FormioError, ValidationError } from './FormioError';

const logger = new Logger('errorUtils');

/**
 * Handle and log an error appropriately
 */
export function handleError(error: unknown, context?: string): Error {
  const err = normalizeError(error);
  
  if (context) {
    logger.error(`Error in ${context}:`, err);
  } else {
    logger.error('An error occurred:', err);
  }

  return err;
}

/**
 * Normalize any value to an Error
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return new Error(String((error as any).message));
  }

  return new Error(String(error));
}

/**
 * Create a validation error
 */
export function createValidationError(
  field: string,
  message: string,
  code?: string
): ValidationError {
  return new ValidationError(field, message, code);
}

/**
 * Check if a value is an error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Check if a value is a FormioError
 */
export function isFormioError(value: unknown): value is FormioError {
  return value instanceof FormioError;
}

/**
 * Get error message safely
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unknown error occurred';
}
