import { VALIDATION_MESSAGES } from '../constants/validationMessages';

type Params = Record<string, any> | undefined;

function formatMessage(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const val = params[key];
    return val !== undefined && val !== null ? String(val) : '';
  });
}

export function getValidationMessage(
  key: keyof typeof VALIDATION_MESSAGES,
  params?: Params,
  translate?: (k: string, fallback?: string) => string
): string {
  const templateKey = `validation.${key}`;
  const translated = translate ? translate(templateKey, VALIDATION_MESSAGES[key]) : undefined;
  const template = translated || VALIDATION_MESSAGES[key];
  return formatMessage(template, params);
}

export default { formatMessage, getValidationMessage };
