import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { FormioComponent } from '../types';

export type ComponentRenderer = (
  component: FormioComponent,
  props: ComponentRenderProps
) => ReactNode;

export interface ComponentRenderProps {
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  formData?: Record<string, any>;
}

export interface ComponentOverrides {
  // Input components
  textfield?: ComponentRenderer;
  number?: ComponentRenderer;
  textarea?: ComponentRenderer;
  email?: ComponentRenderer;
  phoneNumber?: ComponentRenderer;
  url?: ComponentRenderer;
  password?: ComponentRenderer;
  
  // Selection components
  select?: ComponentRenderer;
  checkbox?: ComponentRenderer;
  radio?: ComponentRenderer;
  selectboxes?: ComponentRenderer;
  
  // Date/Time components
  datetime?: ComponentRenderer;
  date?: ComponentRenderer;
  time?: ComponentRenderer;
  day?: ComponentRenderer;
  
  // File components
  file?: ComponentRenderer;
  
  // Layout components
  panel?: ComponentRenderer;
  container?: ComponentRenderer;
  columns?: ComponentRenderer;
  fieldset?: ComponentRenderer;
  well?: ComponentRenderer;
  
  // Action components
  button?: ComponentRenderer;
  
  // Advanced components
  datagrid?: ComponentRenderer;
  editgrid?: ComponentRenderer;
  tree?: ComponentRenderer;
  wizard?: ComponentRenderer;
  
  // Custom components
  [customType: string]: ComponentRenderer | undefined;
}

export interface FormioTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    error?: string;
    success?: string;
    background?: string;
    text?: string;
    border?: string;
    disabled?: string;
  };
  
  input?: {
    borderRadius?: number;
    borderWidth?: number;
    padding?: number;
    fontSize?: number;
  };
  
  label?: {
    fontSize?: number;
    fontWeight?: string;
    marginBottom?: number;
  };
  
  error?: {
    fontSize?: number;
    color?: string;
  };
}

export interface FormioContextValue {
  componentOverrides?: ComponentOverrides;
  theme?: FormioTheme;
  registerComponent: (type: string, renderer: ComponentRenderer) => void;
}

const FormioContext = createContext<FormioContextValue | undefined>(undefined);

export const useFormioContext = () => {
  const context = useContext(FormioContext);
  return context;
};

interface FormioProviderProps {
  children: ReactNode;
  components?: ComponentOverrides;
  theme?: FormioTheme;
}

export const FormioProvider: React.FC<FormioProviderProps> = ({
  children,
  components: initialComponents,
  theme
}) => {
  const [componentOverrides, setComponentOverrides] = 
    useState<ComponentOverrides>(initialComponents || {});

  const registerComponent = useCallback(
    (type: string, renderer: ComponentRenderer) => {
      setComponentOverrides(prev => ({
        ...prev,
        [type]: renderer
      }));
    },
    []
  );

  const value: FormioContextValue = {
    componentOverrides,
    theme,
    registerComponent
  };

  return (
    <FormioContext.Provider value={value}>
      {children}
    </FormioContext.Provider>
  );
};