/**
 * Component Renderers Module
 * 
 * Pre-built component renderers for common Formio component types.
 * These can be registered in the ComponentRegistry for automatic rendering.
 * 
 * @module components/renderers
 */

export { TextfieldRenderer } from './TextfieldRenderer';
export { EmailRenderer } from './EmailRenderer';
export { NumberRenderer } from './NumberRenderer';
export { CheckboxRenderer } from './CheckboxRenderer';
export { RadioRenderer } from './RadioRenderer';
export { SelectRenderer } from './SelectRenderer';
export { SelectboxesRenderer } from './SelectboxesRenderer';
export { TextAreaRenderer } from './TextAreaRenderer';
export { PasswordRenderer } from './PasswordRenderer';
export { URLRenderer } from './URLRenderer';
export { PhoneNumberRenderer } from './PhoneNumberRenderer';
export { FallbackRenderer } from './FallbackRenderer';

/**
 * All available built-in renderers
 */
export const DEFAULT_RENDERERS = {
  textfield: require('./TextfieldRenderer').TextfieldRenderer,
  text: require('./TextfieldRenderer').TextfieldRenderer,
  email: require('./EmailRenderer').EmailRenderer,
  number: require('./NumberRenderer').NumberRenderer,
  checkbox: require('./CheckboxRenderer').CheckboxRenderer,
  radio: require('./RadioRenderer').RadioRenderer,
  select: require('./SelectRenderer').SelectRenderer,
  selectboxes: require('./SelectboxesRenderer').SelectboxesRenderer,
  textarea: require('./TextAreaRenderer').TextAreaRenderer,
  password: require('./PasswordRenderer').PasswordRenderer,
  url: require('./URLRenderer').URLRenderer,
  phoneNumber: require('./PhoneNumberRenderer').PhoneNumberRenderer,
};
