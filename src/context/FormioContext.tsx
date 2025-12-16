import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { FormioComponent } from '../types';
import { I18nConfig } from '../i18n/types';
import { I18nProvider } from '../i18n/I18nContext';

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
    warning?: string;
    info?: string;
    background?: string;
    surface?: string;
    text?: string;
    textSecondary?: string;
    border?: string;
    borderFocus?: string;
    disabled?: string;
    placeholder?: string;
  };
  
  spacing?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  
  typography?: {
    fontFamily?: string;
    fontSize?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
    fontWeight?: {
      light?: string;
      normal?: string;
      medium?: string;
      bold?: string;
    };
    lineHeight?: {
      tight?: number;
      normal?: number;
      relaxed?: number;
    };
  };
  
  borderRadius?: {
    none?: number;
    sm?: number;
    md?: number;
    lg?: number;
    full?: number;
  };
  
  shadows?: {
    sm?: object;
    md?: object;
    lg?: object;
  };
  
  components?: {
    input?: {
      borderRadius?: number;
      borderWidth?: number;
      padding?: number;
      fontSize?: number;
      minHeight?: number;
    };
    
    label?: {
      fontSize?: number;
      fontWeight?: string;
      marginBottom?: number;
      color?: string;
    };
    
    error?: {
      fontSize?: number;
      color?: string;
      marginTop?: number;
    };
    
    button?: {
      borderRadius?: number;
      padding?: number;
      fontSize?: number;
      fontWeight?: string;
      minHeight?: number;
    };
    
    container?: {
      padding?: number;
      marginBottom?: number;
      backgroundColor?: string;
      borderRadius?: number;
    };
  };
}

export interface FormioContextValue {
  componentOverrides?: ComponentOverrides;
  theme?: FormioTheme;
  registerComponent: (type: string, renderer: ComponentRenderer) => void;
  getThemeValue: (path: string, fallback?: any) => any;
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
  i18n?: I18nConfig;
}

const defaultTheme: FormioTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    info: '#5AC8FA',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C7C7CC',
    borderFocus: '#007AFF',
    disabled: '#F2F2F7',
    placeholder: '#C7C7CC',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      bold: '600',
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
  components: {
    input: {
      borderRadius: 8,
      borderWidth: 1,
      padding: 12,
      fontSize: 16,
      minHeight: 44,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
    },
    error: {
      fontSize: 14,
      marginTop: 4,
    },
    button: {
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      fontWeight: '600',
      minHeight: 44,
    },
    container: {
      padding: 16,
      marginBottom: 16,
    },
  },
};

const getNestedValue = (obj: any, path: string, fallback?: any): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj) ?? fallback;
};

const mergeTheme = (base: FormioTheme, override?: FormioTheme): FormioTheme => {
  if (!override) return base;
  
  return {
    colors: { ...base.colors, ...override.colors },
    spacing: { ...base.spacing, ...override.spacing },
    typography: {
      ...base.typography,
      ...override.typography,
      fontSize: { ...base.typography?.fontSize, ...override.typography?.fontSize },
      fontWeight: { ...base.typography?.fontWeight, ...override.typography?.fontWeight },
      lineHeight: { ...base.typography?.lineHeight, ...override.typography?.lineHeight },
    },
    borderRadius: { ...base.borderRadius, ...override.borderRadius },
    shadows: { ...base.shadows, ...override.shadows },
    components: {
      ...base.components,
      ...override.components,
      input: { ...base.components?.input, ...override.components?.input },
      label: { ...base.components?.label, ...override.components?.label },
      error: { ...base.components?.error, ...override.components?.error },
      button: { ...base.components?.button, ...override.components?.button },
      container: { ...base.components?.container, ...override.components?.container },
    },
  };
};

export const FormioProvider: React.FC<FormioProviderProps> = ({
  children,
  components: initialComponents,
  theme: userTheme,
  i18n
}) => {
  const [componentOverrides, setComponentOverrides] = 
    useState<ComponentOverrides>(initialComponents || {});

  const theme = mergeTheme(defaultTheme, userTheme);

  const registerComponent = useCallback(
    (type: string, renderer: ComponentRenderer) => {
      setComponentOverrides(prev => ({
        ...prev,
        [type]: renderer
      }));
    },
    []
  );

  const getThemeValue = useCallback(
    (path: string, fallback?: any) => getNestedValue(theme, path, fallback),
    [theme]
  );

  const value: FormioContextValue = {
    componentOverrides,
    theme,
    registerComponent,
    getThemeValue
  };

  return (
    <FormioContext.Provider value={value}>
      <I18nProvider config={i18n}>
        {children}
      </I18nProvider>
    </FormioContext.Provider>
  );
};