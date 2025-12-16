/**
 * Component type constants
 * 
 * @module constants/componentTypes
 */

/**
 * All supported Formio component types
 */
export const COMPONENT_TYPES = {
  // Input components
  TEXTFIELD: 'textfield',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEXTAREA: 'textarea',
  URL: 'url',
  PHONE_NUMBER: 'phoneNumber',

  // Selection components
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SELECTBOXES: 'selectboxes',

  // Date/Time components
  DATE: 'date',
  DATETIME: 'datetime',
  TIME: 'time',
  DAY: 'day',

  // File components
  FILE: 'file',

  // Layout components
  PANEL: 'panel',
  CONTAINER: 'container',
  COLUMNS: 'columns',
  FIELDSET: 'fieldset',
  WELL: 'well',
  TABS: 'tabs',
  TABLE: 'table',

  // Display components
  BUTTON: 'button',
  HTML: 'html',
  LABEL: 'label',
  HIDDEN: 'hidden',
  CONTENT: 'content',

  // Advanced components
  DATAGRID: 'datagrid',
  EDITGRID: 'editgrid',
  TREE: 'tree',
  WIZARD: 'wizard',
  SIGNATURE: 'signature',
  RESOURCE: 'resource',

  // Custom
  CUSTOM: 'custom',
} as const;

/**
 * Input component types (where input !== false)
 */
export const INPUT_COMPONENT_TYPES = [
  COMPONENT_TYPES.TEXTFIELD,
  COMPONENT_TYPES.EMAIL,
  COMPONENT_TYPES.PASSWORD,
  COMPONENT_TYPES.NUMBER,
  COMPONENT_TYPES.TEXTAREA,
  COMPONENT_TYPES.URL,
  COMPONENT_TYPES.PHONE_NUMBER,
  COMPONENT_TYPES.SELECT,
  COMPONENT_TYPES.CHECKBOX,
  COMPONENT_TYPES.RADIO,
  COMPONENT_TYPES.SELECTBOXES,
  COMPONENT_TYPES.DATE,
  COMPONENT_TYPES.DATETIME,
  COMPONENT_TYPES.TIME,
  COMPONENT_TYPES.DAY,
  COMPONENT_TYPES.FILE,
  COMPONENT_TYPES.DATAGRID,
  COMPONENT_TYPES.EDITGRID,
];

/**
 * Container/Layout component types
 */
export const CONTAINER_COMPONENT_TYPES = [
  COMPONENT_TYPES.PANEL,
  COMPONENT_TYPES.CONTAINER,
  COMPONENT_TYPES.COLUMNS,
  COMPONENT_TYPES.FIELDSET,
  COMPONENT_TYPES.WELL,
  COMPONENT_TYPES.TABS,
  COMPONENT_TYPES.TABLE,
];

/**
 * Display-only component types
 */
export const DISPLAY_COMPONENT_TYPES = [
  COMPONENT_TYPES.BUTTON,
  COMPONENT_TYPES.HTML,
  COMPONENT_TYPES.LABEL,
  COMPONENT_TYPES.HIDDEN,
  COMPONENT_TYPES.CONTENT,
];

export type ComponentType = typeof COMPONENT_TYPES[keyof typeof COMPONENT_TYPES];
