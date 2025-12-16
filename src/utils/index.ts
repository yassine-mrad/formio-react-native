/**
 * Utilities index - export all utility functions
 * 
 * @module utils
 */

export { safeEval, safeEvalConditional, safeEvalValidation, safeEvalValue } from './safeEval';
export type { EvalContext, SafeEvalOptions, SafeEvalResult } from './safeEval';

/**
 * Check if a value is empty (null, undefined, empty string, or empty array)
 */
export function isEmpty(val: any): boolean {
  return val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
}

export { Logger, configureLogger, getLoggerConfig, globalLogger } from './logger';
export type { LoggerConfig } from './logger';
export { LogLevel } from './logger';

// export {
//   isEmpty,
//   traverseComponents,
//   flattenComponents,
//   findComponentByKey,
//   filterComponents,
//   getInputComponents,
//   initializeFormData,
//   getVisibleComponents,
//   isComponentHidden,
//   getRequiredFields,
//   countComponentsByType,
//   getComponentStats,
// } from './componentUtils';
// export type { ComponentCallback, ComponentPredicate } from './componentUtils';

export { createStyleUtilities, createPlatformStyles } from './styleUtils';
export type { StyleUtilities } from './styleUtils';
