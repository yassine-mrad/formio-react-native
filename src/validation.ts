import { FormioComponent, FormData, ValidationError } from './types';
import { getValidationMessage } from './i18n/messages';
import { isEmpty, safeEvalValidation } from './utils';

export const validateField = (
  component: FormioComponent,
  value: any,
  fullData: Record<string, any> = {},
  options?: { translate?: (key: string, fallback?: string) => string }
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const { key, validate = {}, required, label } = component;

  // Required
  if (required || validate.required) {
    if (isEmpty(value)) {
      const msg = options?.translate
        ? options.translate('validation.REQUIRED', `${label || key} is required`)
        : getValidationMessage('REQUIRED');
      errors.push({ field: key, message: msg });
      return errors;
    }
  }

  // String validations
  if (!isEmpty(value) && typeof value === 'string') {
    if (validate.minLength !== undefined && value.length < (validate.minLength as number)) {
      errors.push({ field: key, message: getValidationMessage('MIN_LENGTH', { min: validate.minLength }, options?.translate) });
    }
    if (validate.maxLength !== undefined && value.length > (validate.maxLength as number)) {
      errors.push({ field: key, message: getValidationMessage('MAX_LENGTH', { max: validate.maxLength }, options?.translate) });
    }
    if (validate.pattern && !(new RegExp(validate.pattern)).test(value)) {
      const msg = validate.customMessage || (options?.translate ? options.translate('validation.PATTERN', 'Invalid format') : getValidationMessage('PATTERN'));
      errors.push({ field: key, message: msg });
    }
  }

  // Number validations
  if (!isEmpty(value) && typeof value === 'number') {
    if (validate.min !== undefined && value < (validate.min as number)) {
      errors.push({ field: key, message: getValidationMessage('MIN_VALUE', { min: validate.min }, options?.translate) });
    }
    if (validate.max !== undefined && value > (validate.max as number)) {
      errors.push({ field: key, message: getValidationMessage('MAX_VALUE', { max: validate.max }, options?.translate) });
    }
  }

  // Custom validation (supports imperative valid=... and explicit returns)
  if (validate && validate.custom) {
    const res = safeEvalValidation(validate.custom, { value, data: fullData, row: fullData, util: {} });
    if (res === false) {
      const msg = validate.customMessage || (options?.translate ? options.translate('validation.CUSTOM_ERROR', `${label || key} is invalid`) : getValidationMessage('CUSTOM_ERROR'));
      errors.push({ field: key, message: msg });
    } else if (typeof res === 'string' && res.length > 0) {
      errors.push({ field: key, message: res });
    }
    // If res is true or undefined, validation passes - no error added
  }

  return errors;
};

export const validateForm = (components: FormioComponent[], data: FormData, options?: { translate?: (key: string, fallback?: string) => string }): ValidationError[] => {
  const errors: ValidationError[] = [];

  const traverse = (component: FormioComponent) => {
    // Skip hidden or non-inputs
    if (component.input !== false && !component.hidden) {
      const fieldErrors = validateField(component, (data as any)[component.key], data as any, options);
      errors.push(...fieldErrors);
    }
    // Standard containers
    if (component.components) component.components.forEach(traverse);
    // Columns container
    if (component.type === 'columns' && Array.isArray((component as any).columns)) {
      (component as any).columns.forEach((col: any) => {
        if (Array.isArray(col.components)) col.components.forEach(traverse);
      });
    }
  };

  components.forEach(traverse);
  return errors;
};