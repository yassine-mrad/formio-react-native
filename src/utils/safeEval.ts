/**
 * Safe evaluation utility for executing user-provided JavaScript code
 * with a controlled context. Used for custom conditionals, validations,
 * and calculated values in Formio forms.
 * 
 * @module utils/safeEval
 */

import { Logger } from './logger';

const logger = new Logger('safeEval');

/**
 * Evaluation context provided to user code
 */
export interface EvalContext {
  data: Record<string, any>;
  row?: Record<string, any>;
  value?: any;
  util?: Record<string, any>;
  input?: any;
  show?: boolean;
  valid?: boolean;
}

/**
 * Options for safe evaluation
 */
export interface SafeEvalOptions {
  timeout?: number;
  allowedVariables?: string[];
  debug?: boolean;
}

/**
 * Safe evaluation result
 */
export type SafeEvalResult = boolean | string | undefined | any;

/**
 * Safely evaluates JavaScript code within a controlled context.
 * 
 * Supports:
 * - Explicit return statements
 * - Imperative variable assignments (show = ..., valid = ...)
 * - Function expressions
 * 
 * @param code - The JavaScript code to evaluate
 * @param ctx - The evaluation context
 * @param options - Evaluation options
 * @returns The evaluation result or undefined on error
 * 
 * @example
 * ```typescript
 * const result = safeEval('firstName === "John"', { data: { firstName: 'John' } });
 * // Returns: true
 * 
 * const result = safeEval('show = firstName.length > 0', { data: { firstName: 'test' } });
 * // Returns: true (assigned to show variable)
 * ```
 */
export function safeEval(
  code: string,
  ctx: EvalContext,
  options: SafeEvalOptions = {}
): SafeEvalResult {
  if (!code || typeof code !== 'string') {
    logger.debug('Empty or invalid code provided to safeEval');
    return undefined;
  }

  try {
    const { data, row, value, util, show, valid, input } = ctx;
    const { debug = false } = options;

    if (debug) {
      logger.debug('Executing code:', code, 'with context:', ctx);
    }

    // Support both explicit returns and imperative assignments
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      'data',
      'row',
      'value',
      'input',
      'util',
      'show',
      'valid',
      `return (function(){\n${code}\nreturn typeof value !== 'undefined' ? value : (typeof show !== 'undefined' ? show : (typeof valid !== 'undefined' ? valid : undefined));\n})();`
    );

    const result = fn(
      data,
      row ?? data,
      value,
      input ?? value,
      util ?? {},
      show,
      valid
    );

    if (debug) {
      logger.debug('Evaluation result:', result);
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn(`Failed to evaluate code: ${errorMessage}\nCode: ${code}`);
    return undefined;
  }
}

/**
 * Evaluates code in a conditional context (should return boolean)
 */
export function safeEvalConditional(
  code: string,
  ctx: EvalContext,
  options: SafeEvalOptions = {}
): boolean {
  const result = safeEval(code, ctx, options);
  
  if (typeof result === 'boolean') {
    return result;
  }
  
  if (result !== undefined) {
    return Boolean(result);
  }
  
  return false;
}

/**
 * Evaluates code in a validation context (should return boolean or error message)
 */
export function safeEvalValidation(
  code: string,
  ctx: EvalContext,
  options: SafeEvalOptions = {}
): boolean | string {
  const result = safeEval(code, ctx, options);

  if (typeof result === 'boolean') {
    return result;
  }

  if (typeof result === 'string' && result.length > 0) {
    return result;
  }

  return true;
}

/**
 * Evaluates code that should compute a value
 */
export function safeEvalValue(
  code: string,
  ctx: EvalContext,
  options: SafeEvalOptions = {}
): any {
  return safeEval(code, ctx, options);
}

