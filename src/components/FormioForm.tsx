import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { useI18n } from '../i18n/I18nContext';
import { FormioField } from './FormioField';
import { DatePicker } from './DatePicker';
import { FileUpload } from './FileUpload';
import { ResourceSelect } from './ResourceSelect';
import { DataGrid } from './DataGrid';
import { EditGrid } from './EditGrid';
import { Wizard } from './Wizard';
import { validateForm } from '../validation';
import { FormProps, FormData, ValidationError, FormioComponent } from '../types';
import { useFormioContext, ComponentOverrides } from '../context/FormioContext';
import { safeEvalConditional, safeEvalValue, isEmpty } from '../utils';

const traverseComponents = (components: FormioComponent[], cb: (c: FormioComponent) => void) => {
  const walk = (comp: FormioComponent) => {
    cb(comp);
    if (comp.components) comp.components.forEach(walk);
    if (comp.type === 'columns' && Array.isArray((comp as any).columns)) {
      (comp as any).columns.forEach((col: any) => {
        if (Array.isArray(col.components)) col.components.forEach(walk);
      });
    }
  };
  components.forEach(walk);
};

const flatten = (components: FormioComponent[]): FormioComponent[] => {
  const out: FormioComponent[] = [];
  traverseComponents(components, (c) => out.push(c));
  return out;
};

const initDefaults = (components: FormioComponent[], data: FormData): FormData => {
  const flat = flatten(components);
  const next: FormData = { ...data };
  for (const c of flat) {
    if (c.input !== false && c.key && next[c.key] === undefined) {
      if (c.defaultValue !== undefined) next[c.key] = c.defaultValue;
    }
  }
  return next;
};

const isHidden = (component: FormioComponent, data: FormData): boolean => {
  if (component.hidden) return true;
  const value = data[component.key];
  if (component.customConditional) {
    const res = safeEvalConditional(component.customConditional, { data, value, row: data, util: {} });
    return !res;
  }
  if (component.conditional && component.conditional.when) {
    const whenVal = data[component.conditional.when];
    const eq = component.conditional.eq;
    const show = component.conditional.show !== false; // default true
    const match = whenVal === eq;
    return show ? !match : match;
  }
  return false;
};

const applyCalculations = (components: FormioComponent[], data: FormData): FormData => {
  const flat = flatten(components);
  let changed = true;
  let guard = 0;
  let next = { ...data };
  while (changed && guard < 5) {
    changed = false;
    guard++;
    for (const c of flat) {
      if (c.calculateValue) {
        const current = next[c.key];
        const calc = safeEvalValue(c.calculateValue, { data: next, value: current, row: next, util: {} });
        if (calc !== undefined && calc !== current) {
          next = { ...next, [c.key]: calc };
          changed = true;
        }
      }
    }
  }
  return next;
};

export const FormioForm: React.FC<FormProps> = ({
  form,
  data: initialData = {},
  options,
  components: propComponents,
  onSubmit,
  onChange,
  onValidation,
}) => {
  const context = useFormioContext();
  const { translate, isRTL } = useI18n();
  
  // Merge overrides: prop components > context components > built-in
  const componentOverrides = {
    ...context?.componentOverrides,
    ...propComponents
  };
  
  const theme = context?.theme;
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Handle wizard forms at the top level
  if (form.display === 'wizard') {
    return (
      <ScrollView style={styles.form}>
        {form.title && <Text style={styles.title}>{form.title}</Text>}
        <Wizard
          form={form}
           // @ts-ignore
          component={{ type: 'wizard', key: 'wizard', pages: form.components }}
          data={formData}
          setData={setFormData}
          errors={errors}
          onValidation={setErrors}
          onFinish={() => {
              const validationErrors = validateForm(form.components, formData, { translate });
              if (validationErrors.length === 0) {
                onSubmit?.(formData);
              } else {
                setErrors(validationErrors);
              }
            }}
        />
      </ScrollView>
    );
  }

  // Initialize defaults and calculations on mount/form change
  useEffect(() => {
    let next = initDefaults(form.components, initialData);
    next = applyCalculations(form.components, next);
    setFormData(next);
    const validationErrors = validateForm(form.components, next, { translate });
    setErrors(validationErrors);
    onValidation?.(validationErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Revalidate when data changes from external source
  useEffect(() => {
    const validationErrors = validateForm(form.components, formData, { translate });
    setErrors(validationErrors);
    onValidation?.(validationErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleFieldChange = (key: string, value: any) => {
    let next = { ...formData, [key]: value };
    // Apply calculations after every change
    next = applyCalculations(form.components, next);
    setFormData(next);
    onChange?.(next);
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(form.components, formData, { translate });
    if (validationErrors.length === 0) {
      onSubmit?.(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const getFieldError = (key: string) => errors.find(e => e.field === key)?.message;

  const renderComponent = (component: FormioComponent): React.ReactNode => {
    if (isHidden(component, formData)) return null;

    // Check for custom renderer in order of precedence
    const customRenderer = 
      componentOverrides?.[component.type] ||
      componentOverrides?.[component.key]; // Allow key-specific overrides

    if (customRenderer) {
      return customRenderer(component, {
        value: formData[component.key],
        onChange: (value) => handleFieldChange(component.key, value),
        error: getFieldError(component.key),
        disabled: component.disabled || false,
        readOnly: options?.readOnly || false,
        formData
      });
    }

    // Submit button shortcut
    if (component.type === 'button' && component.key === 'submit') {
      return (
        <TouchableOpacity
          key={component.key}
          style={[styles.submitButton, theme?.colors?.primary && { backgroundColor: theme.colors.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {translate(component.label || 'Submit', component.label || 'Submit')}
          </Text>
        </TouchableOpacity>
      );
    }

    // Wizard container - check for wizard display or type
    if (component.type === 'wizard' || form.display === 'wizard') {
      const wizardPages = (component as any).pages || form.components || [];
      return (
        <Wizard
          key={component.key || 'wizard'}
          form={form}
          component={{ ...component, pages: wizardPages, type: 'wizard' }}
          data={formData}
          setData={(d: any) => setFormData(d)}
          errors={errors}
          onFinish={handleSubmit}
        />
      );
    }

    // Columns container
    if (component.type === 'columns' && Array.isArray((component as any).columns)) {
      const cols = (component as any).columns as Array<{ components: FormioComponent[] }>;
      return (
        <View key={component.key} style={styles.columnsContainer}>
          {component.label ? <Text style={[styles.containerLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{translate(component.label, component.label)}</Text> : null}
          <View style={styles.columnsRow}>
            {cols.map((col, i) => (
              <View key={`${component.key}-col-${i}`} style={styles.column}>
                {Array.isArray(col.components) ? col.components.map(renderComponent) : null}
              </View>
            ))}
          </View>
        </View>
      );
    }

    // Containers (skip wizard type)
    if (component.components && component.components.length && component.type !== 'wizard') {
      const children = component.components.map(renderComponent).filter(Boolean);
      if (children.length === 0) return null;
      return (
        <View key={component.key} style={styles.container}>
          {children}
        </View>
      );
    }

    if (component.input === false) return null;



    // Advanced built-ins by type mapping
    switch (component.type) {
      case 'date':
      case 'datetime':
      case 'time':
        return (
          <DatePicker
            key={component.key}
            // @ts-ignore
            component={component as any}
            value={formData[component.key]}
            onChange={(val) => handleFieldChange(component.key, val)}
            error={getFieldError(component.key)}
            disabled={(component as any).disabled}
            readOnly={options?.readOnly}
          />
        );
      case 'file':
        return (
          <FileUpload
            key={component.key}
            // @ts-ignore
            component={component as any}
            value={formData[component.key]}
            onChange={(val) => handleFieldChange(component.key, val)}
            error={getFieldError(component.key)}
            disabled={(component as any).disabled}
            readOnly={options?.readOnly}
          />
        );
      case 'datagrid':
        return (
          <DataGrid
            key={component.key}
            // @ts-ignore
            component={component as any}
            value={formData[component.key]}
            onChange={(val) => handleFieldChange(component.key, val)}
            error={getFieldError(component.key)}
            disabled={(component as any).disabled}
            readOnly={options?.readOnly}
          />
        );
      case 'editgrid':
        return (
          <EditGrid
            key={component.key}
            // @ts-ignore
            component={component as any}
            value={formData[component.key]}
            onChange={(val) => handleFieldChange(component.key, val)}
            error={getFieldError(component.key)}
            disabled={(component as any).disabled}
            readOnly={options?.readOnly}
          />
        );
      case 'select': {

          return (
            <ResourceSelect
              key={component.key}
              // @ts-ignore
              component={component as any}
              value={formData[component.key]}
              onChange={(val) => handleFieldChange(component.key, val)}
              error={getFieldError(component.key)}
              disabled={(component as any).disabled}
              readOnly={options?.readOnly}
            />
          );
      }
      case 'PlatformFileInput':
        return (
          <FileUpload
            key={component.key}
            // @ts-ignore
            component={component as any}
            value={formData[component.key]}
            onChange={(val) => handleFieldChange(component.key, val)}
            error={getFieldError(component.key)}
            disabled={(component as any).disabled}
            readOnly={options?.readOnly}
          />
        );
    }

    // Fallback generic field
    return (
      <FormioField
        key={component.key}
        component={component}
        value={formData[component.key]}
        onChange={handleFieldChange}
        error={getFieldError(component.key)}

      />
    );
  };

  return (
    <ScrollView style={[styles.form, { direction: isRTL ? 'rtl' : 'ltr' }]}>

      {form.components.map((c, index) => (
        <React.Fragment key={c.key || index}>
          {renderComponent(c)}
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  container: {
    marginBottom: 16,
  },
  columnsContainer: {
    marginBottom: 16,
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  containerLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});