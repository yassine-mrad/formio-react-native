import { FormioComponent, FormData, ValidationError } from './types';

const isEmpty = (val: any) => val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);

const safeEval = (code: string, ctx: Record<string, any>): boolean | string | undefined => {
  try {
    // Support explicit returns and imperative 'valid = ...' assignments
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      'data', 'row', 'value', 'input', 'util', 'valid',
      `return (function(){\n${code}\nreturn typeof valid !== 'undefined' ? valid : undefined;\n})();`
    );
    return fn(
      ctx.data,
      ctx.row ?? ctx.data,
      ctx.value,
      ctx.value, // input alias for compatibility
      ctx.util ?? {},
      undefined
    );
  } catch (e) {
    // Default to pass on error; optionally log in dev
    return undefined;
  }
};

export const validateField = (component: FormioComponent, value: any, fullData: Record<string, any> = {}): ValidationError[] => {
  const errors: ValidationError[] = [];
  const { key, validate = {}, required, label } = component;

  // Required
  if (required || validate.required) {
    if (isEmpty(value)) {
      errors.push({ field: key, message: `${label || key} is required` });
      return errors;
    }
  }

  // String validations
  if (!isEmpty(value) && typeof value === 'string') {
    if (validate.minLength !== undefined && value.length < (validate.minLength as number)) {
      errors.push({ field: key, message: `Minimum length is ${validate.minLength}` });
    }
    if (validate.maxLength !== undefined && value.length > (validate.maxLength as number)) {
      errors.push({ field: key, message: `Maximum length is ${validate.maxLength}` });
    }
    if (validate.pattern && !(new RegExp(validate.pattern)).test(value)) {
      errors.push({ field: key, message: validate.customMessage || 'Invalid format' });
    }
  }

  // Number validations
  if (!isEmpty(value) && typeof value === 'number') {
    if (validate.min !== undefined && value < (validate.min as number)) {
      errors.push({ field: key, message: `Minimum value is ${validate.min}` });
    }
    if (validate.max !== undefined && value > (validate.max as number)) {
      errors.push({ field: key, message: `Maximum value is ${validate.max}` });
    }
  }

  // Custom validation (supports imperative valid=... and explicit returns)
  if (validate && validate.custom) {
    const res = safeEval(validate.custom, { value, data: fullData, row: fullData, util: {} });
    if (res === false) {
      errors.push({ field: key, message: validate.customMessage || `${label || key} is invalid` });
    } else if (typeof res === 'string' && res.length > 0) {
      errors.push({ field: key, message: res });
    }
  }

  return errors;
};

export const validateForm = (components: FormioComponent[], data: FormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  const traverse = (component: FormioComponent) => {
    // Skip hidden or non-inputs
    if (component.input !== false && !component.hidden) {
      const fieldErrors = validateField(component, (data as any)[component.key], data as any);
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