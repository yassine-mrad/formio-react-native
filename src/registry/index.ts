/**
 * Component Registry Module
 * 
 * Provides a centralized registry system for managing component renderers,
 * enabling dynamic component loading and custom component support.
 * 
 * @module registry
 */

export { ComponentRegistry, createDefaultRegistry, createRegistryWithComponents } from './ComponentRegistry';
export type { ComponentRenderer, ComponentRenderProps } from './ComponentRegistry';
