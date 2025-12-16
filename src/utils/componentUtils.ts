/**
 * Utilities for traversing and manipulating Formio component trees
 * 
 * @module utils/componentUtils
 */

import { FormioComponent, FormData } from '../types';
import { Logger } from './logger';

const logger = new Logger('componentUtils');

/**
 * Callback function for component traversal
 */
export type ComponentCallback = (component: FormioComponent, index?: number, path?: string) => void;

/**
 * Predicate function for filtering components
 */
export type ComponentPredicate = (component: FormioComponent) => boolean;

/**
 * Check if a value is empty (null, undefined, empty string, or empty array)
 */
export function isEmpty(val: any): boolean {
  return (
    val === undefined ||
    val === null ||
    val === '' ||
    (Array.isArray(val) && val.length === 0)
  );
}

/**
 * Traverse component tree recursively
 * 
 * Handles:
 * - Standard components with nested components
 * - Column layout containers
 * 
 * @param components - Root level components
 * @param callback - Function called for each component
 */
export function traverseComponents(
  components: FormioComponent[],
  callback: ComponentCallback
): void {
  const walk = (component: FormioComponent, path: string = '') => {
    callback(component, undefined, path);

    if (component.components) {
      component.components.forEach((child, index) => {
        walk(child, `${path}[${index}]`);
      });
    }

    // Handle columns layout
    if (component.type === 'columns' && Array.isArray((component as any).columns)) {
      (component as any).columns.forEach((col: any, colIndex: number) => {
        if (Array.isArray(col.components)) {
          col.components.forEach((child: FormioComponent, index: number) => {
            walk(child, `${path}.columns[${colIndex}][${index}]`);
          });
        }
      });
    }
  };

  components.forEach((component, index) => {
    walk(component, `[${index}]`);
  });
}

/**
 * Flatten component tree into a single array
 */
export function flattenComponents(components: FormioComponent[]): FormioComponent[] {
  const flattened: FormioComponent[] = [];
  traverseComponents(components, (component) => {
    flattened.push(component);
  });
  return flattened;
}

/**
 * Find a component by key in the component tree
 */
export function findComponentByKey(
  components: FormioComponent[],
  key: string
): FormioComponent | undefined {
  let found: FormioComponent | undefined;

  traverseComponents(components, (component) => {
    if (component.key === key) {
      found = component;
    }
  });

  return found;
}

/**
 * Filter components matching a predicate
 */
export function filterComponents(
  components: FormioComponent[],
  predicate: ComponentPredicate
): FormioComponent[] {
  const filtered: FormioComponent[] = [];
  traverseComponents(components, (component) => {
    if (predicate(component)) {
      filtered.push(component);
    }
  });
  return filtered;
}

/**
 * Get all input components (where input !== false)
 */
export function getInputComponents(components: FormioComponent[]): FormioComponent[] {
  return filterComponents(components, (c) => c.input !== false && c.key);
}

/**
 * Initialize form data with default values from component tree
 */
export function initializeFormData(
  components: FormioComponent[],
  initialData: FormData = {}
): FormData {
  const data = { ...initialData };
  const inputComponents = getInputComponents(components);

  inputComponents.forEach((component) => {
    if (component.key && data[component.key] === undefined) {
      if (component.defaultValue !== undefined) {
        data[component.key] = component.defaultValue;
      }
    }
  });

  logger.debug('Initialized form data', data);
  return data;
}

/**
 * Get all non-hidden, visible components
 */
export function getVisibleComponents(
  components: FormioComponent[],
  data: FormData
): FormioComponent[] {
  return filterComponents(
    components,
    (c) => !c.hidden && c.type !== 'hidden'
  );
}

/**
 * Check if component should be hidden based on conditionals
 */
export function isComponentHidden(
  component: FormioComponent,
  data: FormData,
  evaluator?: (code: string, context: any) => boolean
): boolean {
  if (component.hidden) {
    return true;
  }

  // Handle simple conditional
  if (component.conditional?.when) {
    const { when, eq, show = true } = component.conditional;
    const whenValue = data[when];
    const match = whenValue === eq;
    return show ? !match : match;
  }

  // Handle custom conditional
  if (component.customConditional && evaluator) {
    try {
      const result = evaluator(component.customConditional, { data, value: data[component.key] });
      return !result;
    } catch (error) {
      logger.warn(`Failed to evaluate customConditional for ${component.key}`, error);
      return false;
    }
  }

  return false;
}

/**
 * Get required input fields (without values)
 */
export function getRequiredFields(components: FormioComponent[]): string[] {
  return filterComponents(
    components,
    (c) => (c.required || c.validate?.required) && c.key && c.input !== false
  ).map((c) => c.key);
}

/**
 * Count components of a specific type
 */
export function countComponentsByType(
  components: FormioComponent[],
  type: string
): number {
  return filterComponents(components, (c) => c.type === type).length;
}

/**
 * Get component statistics for debugging
 */
export function getComponentStats(components: FormioComponent[]) {
  const all = flattenComponents(components);
  const inputs = getInputComponents(components);
  const types = new Map<string, number>();

  all.forEach((c) => {
    types.set(c.type, (types.get(c.type) || 0) + 1);
  });

  return {
    total: all.length,
    inputCount: inputs.length,
    typeDistribution: Object.fromEntries(types),
  };
}
