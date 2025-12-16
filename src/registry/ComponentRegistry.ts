/**
 * Component Registry System for dynamic component loading and custom components
 * 
 * @module registry/ComponentRegistry
 */

import React, { ReactNode } from 'react';
import { FormioComponent, FormData, ValidationError } from '../types';
import { Logger } from '../utils/logger';

const logger = new Logger('ComponentRegistry');

/**
 * Props passed to component renderers
 */
export interface ComponentRenderProps {
  /** The component schema */
  component: FormioComponent;
  /** Current field value */
  value: any;
  /** Change handler */
  onChange: (value: any) => void;
  /** Validation error message */
  error?: string;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Whether field is read-only */
  readOnly?: boolean;
  /** Complete form data */
  formData?: FormData;
  /** Validation errors for this field */
  validationErrors?: ValidationError[];
}

/**
 * Component renderer function type
 */
export type ComponentRenderer = (props: ComponentRenderProps) => ReactNode;

/**
 * Component registry for managing component renderers
 * Supports built-in components and custom component registration
 * 
 * @example
 * ```typescript
 * const registry = new ComponentRegistry();
 * registry.register('textfield', TextfieldRenderer);
 * registry.register('custom', CustomRenderer);
 * 
 * const renderer = registry.get('textfield');
 * ```
 */
export class ComponentRegistry {
  private renderers: Map<string, ComponentRenderer> = new Map();

  /**
   * Register a component renderer
   */
  register(type: string, renderer: ComponentRenderer): void {
    if (!type || typeof type !== 'string') {
      logger.warn('Invalid component type for registration');
      return;
    }

    if (typeof renderer !== 'function') {
      logger.warn(`Invalid renderer for component type: ${type}`);
      return;
    }

    this.renderers.set(type, renderer);
    logger.debug(`Registered component: ${type}`);
  }

  /**
   * Register multiple components at once
   */
  registerBatch(components: Record<string, ComponentRenderer>): void {
    Object.entries(components).forEach(([type, renderer]) => {
      this.register(type, renderer);
    });
    logger.debug(`Registered ${Object.keys(components).length} components`);
  }

  /**
   * Unregister a component renderer
   */
  unregister(type: string): boolean {
    const existed = this.renderers.has(type);
    this.renderers.delete(type);
    if (existed) {
      logger.debug(`Unregistered component: ${type}`);
    }
    return existed;
  }

  /**
   * Get a component renderer
   */
  get(type: string): ComponentRenderer | null {
    return this.renderers.get(type) || null;
  }

  /**
   * Check if component type is registered
   */
  has(type: string): boolean {
    return this.renderers.has(type);
  }

  /**
   * List all registered component types
   */
  list(): string[] {
    return Array.from(this.renderers.keys());
  }

  /**
   * Get number of registered components
   */
  count(): number {
    return this.renderers.size;
  }

  /**
   * Clear all registered components
   */
  clear(): void {
    this.renderers.clear();
    logger.debug('Cleared all registered components');
  }

  /**
   * Override an existing component renderer
   */
  override(type: string, renderer: ComponentRenderer): boolean {
    if (!this.has(type)) {
      logger.warn(`Cannot override non-existent component: ${type}`);
      return false;
    }

    this.register(type, renderer);
    logger.debug(`Overrode component: ${type}`);
    return true;
  }

  /**
   * Get component stats for debugging
   */
  getStats() {
    return {
      totalRegistered: this.renderers.size,
      types: this.list(),
    };
  }
}

/**
 * Create a default registry with all built-in components
 * This is populated later when component renderers are created
 */
export function createDefaultRegistry(): ComponentRegistry {
  const registry = new ComponentRegistry();
  logger.debug('Created default registry');
  return registry;
}

/**
 * Create a registry instance with custom initial components
 */
export function createRegistryWithComponents(
  components: Record<string, ComponentRenderer>
): ComponentRegistry {
  const registry = createDefaultRegistry();
  registry.registerBatch(components);
  return registry;
}
