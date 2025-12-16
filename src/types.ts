/**
 * @module types
 * Type definitions for Formio React Native library
 */

/**
 * Any value type that can be stored in a form
 */
export type FormioValue = any;

/**
 * Simple conditional visibility logic
 * 
 * @example
 * ```typescript
 * const conditional: Conditional = {
 *   when: 'userType',
 *   eq: 'admin',
 *   show: true  // Show this field when userType equals 'admin'
 * };
 * ```
 */
export interface Conditional {
  /** Field key to check */
  show?: boolean;
  /** Field to check */
  when?: string;
  /** Value to match */
  eq?: any;
  /** Optional JSON-based condition */
  json?: string;
}

/**
 * Validation rules for form fields
 * 
 * @example
 * ```typescript
 * const validate: ValidateRule = {
 *   required: true,
 *   minLength: 3,
 *   maxLength: 50,
 *   pattern: '^[A-Za-z]+$'
 * };
 * ```
 */
export interface ValidateRule {
  /** Field is required */
  required?: boolean;
  /** Minimum string length */
  minLength?: number;
  /** Maximum string length */
  maxLength?: number;
  /** Regular expression pattern for validation */
  pattern?: string;
  /** Minimum numeric value */
  min?: number;
  /** Maximum numeric value */
  max?: number;
  /** Custom validation JavaScript code. Return true/false or error message string */
  custom?: string;
  /** Custom error message to display */
  customMessage?: string;
}

/**
 * Data source for populating select/radio/checkbox options
 * 
 * @example
 * ```typescript
 * // Static values
 * const data: DataSource = {
 *   dataSrc: 'values',
 *   values: [
 *     { label: 'Option 1', value: 'opt1' },
 *     { label: 'Option 2', value: 'opt2' }
 *   ]
 * };
 * ```
 */
export type DataSrc = 'values' | 'json' | 'resource' | 'url';

export interface DataSource {
  /** How to load data */
  dataSrc?: DataSrc;
  /** Static array of {label, value} pairs */
  values?: Array<{ label: string; value: any }>;
  /** JSON data path or object */
  json?: any;
  /** Formio resource name (not implemented in RN) */
  resource?: string;
  /** URL to fetch data from (not implemented in RN) */
  url?: string;
}

/**
 * Base interface for all Formio component configurations
 * 
 * @example
 * ```typescript
 * const component: FormioComponent = {
 *   type: 'textfield',
 *   key: 'firstName',
 *   label: 'First Name',
 *   placeholder: 'Enter your first name',
 *   required: true,
 *   validate: {
 *     minLength: 2,
 *     maxLength: 50
 *   }
 * };
 * ```
 */
export interface FormioComponentBase {
  /** Component type (textfield, email, select, etc.) */
  type: string;
  /** Unique identifier for the component */
  key: string;
  /** Display label for the component */
  label?: string;
  /** Help text description */
  description?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Hide the component */
  hidden?: boolean;
  /** Allow multiple values */
  multiple?: boolean;
  /** Default value when form initializes */
  defaultValue?: any;
  /** Whether this is an input component (defaults to true) */
  input?: boolean;
  /** Nested components for container types */
  components?: FormioComponent[];
  /** Simple conditional visibility */
  conditional?: Conditional;
  /** Complex conditional JavaScript code */
  customConditional?: string;
  /** JavaScript code to calculate value */
  calculateValue?: string;
  /** Validation rules */
  validate?: ValidateRule;
  /** Data source for select/checkbox/radio components */
  data?: DataSource;
}

export type FormioComponent = FormioComponentBase & {
  /** Additional schema-specific fields can be added here as needed */
  [key: string]: any;
};

/**
 * Date/datetime/time component
 */
export interface DateComponent extends FormioComponent {
  type: 'date' | 'datetime' | 'time';
  /** Date format string */
  format?: string;
  /** Whether to show time picker */
  enableTime?: boolean;
  /** Whether to show date picker */
  enableDate?: boolean;
  /** Minimum selectable date */
  minDate?: string;
  /** Maximum selectable date */
  maxDate?: string;
  /** Widget type */
  widget?: string;
  validate?: ValidateRule & {
    min?: string;
    max?: string;
  };
}

/**
 * File upload component
 */
export interface FileComponent extends FormioComponent {
  type: 'file';
  /** Where to store uploaded files */
  storage?: 'base64' | 's3' | 'url' | 'fileSystem';
  /** Allowed file types/extensions */
  fileTypes?: string[];
  /** Allow multiple file uploads */
  multiple?: boolean;
  validate?: ValidateRule & {
    maxSize?: string;
  };
}

/**
 * Select component with resource loading
 */
export interface ResourceSelectComponent extends FormioComponent {
  type: 'select';
  data?: DataSource & {
    dataSrc: 'url' | 'resource';
    url?: string;
    resource?: string;
    searchField?: string;
  };
  /** Enable search/filter in options */
  searchEnabled?: boolean;
  /** Debounce time for search */
  debounce?: number;
  placeholder?: string;
}

/**
 * Data grid component for tabular data
 */
export interface DataGridComponent extends FormioComponent {
  type: 'datagrid';
  /** Column definitions */
  components: FormioComponent[];
  /** Minimum number of rows */
  minLength?: number;
  /** Maximum number of rows */
  maxLength?: number;
  validate?: ValidateRule;
}

/**
 * Edit grid component for inline editable rows
 */
export interface EditGridComponent extends FormioComponent {
  type: 'editgrid';
  /** Column definitions */
  components: FormioComponent[];
  /** Allow inline editing without modal */
  inlineEdit?: boolean;
}

/**
 * Columns layout component
 */
export interface ColumnsComponent extends FormioComponent {
  type: 'columns';
  /** Column definitions with layout */
  columns: Array<{
    width?: number;
    offset?: number;
    push?: number;
    pull?: number;
    components: FormioComponent[];
  }>;
}

/**
 * Wizard page panel
 */
export interface WizardPage extends FormioComponent {
  type: 'panel';
  components: FormioComponent[];
}

/**
 * Wizard multi-step form
 */
export interface WizardComponent extends FormioComponent {
  type: 'wizard';
  /** Form pages/steps */
  pages: WizardPage[];
}

/**
 * Form schema/definition
 */
export interface FormioFormSchema {
  /** Root level components */
  components: FormioComponent[];
  /** Form display mode */
  display?: string;
  /** Form title */
  title?: string;
}

/**
 * Form submission data
 */
export interface FormData {
  [key: string]: any;
}

/**
 * Form field validation error
 */
export interface ValidationError {
  /** Field key that has error */
  field: string;
  /** Error message */
  message: string;
}

/**
 * Form rendering options
 */
export interface RenderOptions {
  /** Show all fields as read-only */
  readOnly?: boolean;
  /** Show all validation errors at once */
  showAllErrors?: boolean;
}

/**
 * Props for FormioForm component
 * 
 * @example
 * ```typescript
 * const handleSubmit = (data: FormData) => {
 *   console.log('Form submitted:', data);
 * };
 * 
 * <FormioForm
 *   form={formSchema}
 *   data={initialData}
 *   onSubmit={handleSubmit}
 *   onChange={(data) => console.log('Data changed:', data)}
 * />
 * ```
 */
export interface FormProps {
  /** Form schema definition */
  form: FormioFormSchema;
  /** Initial form data */
  data?: FormData;
  /** Rendering options */
  options?: RenderOptions;
  /** Custom component renderers by type */
  components?: { [type: string]: any };
  /** Callback when form is submitted */
  onSubmit?: (data: FormData) => void;
  /** Callback when form data changes */
  onChange?: (data: FormData) => void;
  /** Callback when validation state changes */
  onValidation?: (errors: ValidationError[]) => void;
}
