export type FormioValue = any;

export interface Conditional {
  show?: boolean;
  when?: string;
  eq?: any;
  json?: string;
}

export interface ValidateRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  custom?: string; // JS expression or function body. Should return true (valid) or a string (error message).
  customMessage?: string;
}

export type DataSrc = 'values' | 'json' | 'resource' | 'url';

export interface DataSource {
  dataSrc?: DataSrc;
  values?: Array<{ label: string; value: any }>; // For dataSrc: 'values'
  json?: any; // For dataSrc: 'json'
  resource?: string; // Not implemented in RN core renderer
  url?: string; // Not implemented in RN core renderer
}

export interface FormioComponentBase {
  type: string;
  key: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  multiple?: boolean;
  defaultValue?: any;
  input?: boolean; // Defaults to true unless specified false
  components?: FormioComponent[]; // For containers
  conditional?: Conditional; // Simple conditional
  customConditional?: string; // JS expression to compute visibility; return boolean
  calculateValue?: string; // JS expression; should return computed value
  validate?: ValidateRule;
  data?: DataSource; // For select/radio/etc.
}

export type FormioComponent = FormioComponentBase & {
  // Additional schema-specific fields can be added here as needed
};

// Advanced component interfaces
export interface DateComponent extends FormioComponent {
  type: 'date' | 'datetime' | 'time';
  format?: string;
  enableTime?: boolean;
  enableDate?: boolean;
  minDate?: string; // ISO or relative
  maxDate?: string; // ISO or relative
  widget?: string; // for parity
  validate?: ValidateRule & {
    min?: string; // ISO
    max?: string; // ISO
  };
}

export interface FileComponent extends FormioComponent {
  type: 'file';
  storage?: 'base64' | 's3' | 'url' | 'fileSystem';
  fileTypes?: string[];
  multiple?: boolean;
  validate?: ValidateRule & {
    maxSize?: string; // e.g. 10MB
  };
}

export interface ResourceSelectComponent extends FormioComponent {
  type: 'select';
  data?: DataSource & {
    dataSrc: 'url' | 'resource';
    url?: string;
    resource?: string;
    searchField?: string;
  };
  searchEnabled?: boolean;
  debounce?: number;
  placeholder?: string;
}

export interface DataGridComponent extends FormioComponent {
  type: 'datagrid';
  components: FormioComponent[];
  minLength?: number;
  maxLength?: number;
  validate?: ValidateRule;
}

export interface EditGridComponent extends FormioComponent {
  type: 'editgrid';
  components: FormioComponent[];
  inlineEdit?: boolean;
}

// Columns container
export interface ColumnsComponent extends FormioComponent {
  type: 'columns';
  columns: Array<{
    width?: number;
    offset?: number;
    push?: number;
    pull?: number;
    components: FormioComponent[];
  }>;
}

export interface WizardPage extends FormioComponent {
  type: 'panel';
  components: FormioComponent[];
}

export interface WizardComponent extends FormioComponent {
  type: 'wizard';
  pages: WizardPage[];
}

export interface FormioFormSchema {
  components: FormioComponent[];
  display?: string;
  title?: string;
}

export interface FormData {
  [key: string]: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface RenderOptions {
  readOnly?: boolean;
  showAllErrors?: boolean;
}

export interface FormProps {
  form: FormioFormSchema;
  data?: FormData;
  options?: RenderOptions;
  components?: { [type: string]: any }; // Custom component renderers by type
  onSubmit?: (data: FormData) => void;
  onChange?: (data: FormData) => void;
  onValidation?: (errors: ValidationError[]) => void;
}
