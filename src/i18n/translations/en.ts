export const DEFAULT_EN_TRANSLATIONS: Record<string, string> = {
  // Validation messages (prefixed as used by getValidationMessage)
  'validation.REQUIRED': 'This field is required',
  'validation.MIN_LENGTH': 'Minimum length is {min}',
  'validation.MAX_LENGTH': 'Maximum length is {max}',
  'validation.PATTERN': 'Invalid format',
  'validation.MIN_VALUE': 'Minimum value is {min}',
  'validation.MAX_VALUE': 'Maximum value is {max}',
  'validation.INVALID_EMAIL': 'Invalid email address',
  'validation.INVALID_URL': 'Invalid URL',
  'validation.INVALID_PHONE': 'Invalid phone number',
  'validation.INVALID_DATE': 'Invalid date',
  'validation.FILE_TYPE_INVALID': 'Invalid file type',
  'validation.FILE_SIZE_TOO_LARGE': 'File is too large',
  'validation.CUSTOM_ERROR': 'This field is invalid',

  // Common UI strings
  'Submit': 'Submit',
  'Previous': 'Previous',
  'Next': 'Next',
  'Finish': 'Finish',
  'Loading...': 'Loading...',
  'Search...': 'Search...',
  'No options available': 'No options available',
  'Select...': 'Select...',
  'No wizard pages found': 'No wizard pages found',

  // Component labels
  'First Name': 'First Name',
  'Last Name': 'Last Name',
  'Email': 'Email',
  'Phone': 'Phone',
  'Address': 'Address',
  'City': 'City',
  'State': 'State',
  'Zip Code': 'Zip Code',
  'Country': 'Country',
  'Message': 'Message',
  'Comments': 'Comments',
  'Agree': 'I Agree',
  'Yes': 'Yes',
  'No': 'No',
  'OK': 'OK',
  'Cancel': 'Cancel',
  'Delete': 'Delete',
  'Edit': 'Edit',
  'Add': 'Add',
  'Remove': 'Remove',
  'Save': 'Save',
  'Close': 'Close',
  'Done': 'Done',
};

import AR_TRANSLATIONS from '../locales/ar';
import FR_TRANSLATIONS from '../locales/fr';

export const DEFAULT_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: DEFAULT_EN_TRANSLATIONS,
  ar: AR_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
};

export default DEFAULT_TRANSLATIONS;
