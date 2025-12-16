/**
 * Validation message constants
 * 
 * @module constants/validationMessages
 */

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  MIN_LENGTH: 'Minimum length is {min}',
  MAX_LENGTH: 'Maximum length is {max}',
  PATTERN: 'Invalid format',
  MIN_VALUE: 'Minimum value is {min}',
  MAX_VALUE: 'Maximum value is {max}',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_URL: 'Invalid URL',
  INVALID_PHONE: 'Invalid phone number',
  INVALID_DATE: 'Invalid date',
  FILE_TYPE_INVALID: 'Invalid file type',
  FILE_SIZE_TOO_LARGE: 'File is too large',
  CUSTOM_ERROR: 'This field is invalid',
} as const;

export type ValidationMessageKey = keyof typeof VALIDATION_MESSAGES;
