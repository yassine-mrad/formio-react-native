import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FormioField } from './FormioField';
import { validateForm } from '../validation';
import { FormProps, FormData, ValidationError, FormioComponent } from '../types';

const isEmpty = (val: any) => val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);

const safeEval = (code: string, ctx: Record<string, any>) => {
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('data', 'row', 'value', 'util', `return (function(){ ${code}; })();`);
    return fn(ctx.data, ctx.row ?? ctx.data, ctx.value, ctx.util ?? {});
  } catch (e) {
    return undefined;
  }
};

const flatten = (components: FormioComponent[]): FormioComponent[] => {
  const out: FormioComponent[] = [];
  const walk = (comp: FormioComponent) => {
    out.push(comp);
    if (comp.components) comp.components.forEach(walk);
  };
  components.forEach(walk);
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
  // customConditional JS: returns boolean visible
  if (component.customConditional) {
    const visible = !!safeEval(component.customConditional, { data, value, row: data, util: {} });
    return !visible;
  }
  // simple conditional
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
        const calc = safeEval(c.calculateValue, { data: next, value: current, row: next, util: {} });
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
  components: customComponents,
  onSubmit,
  onChange,
  onValidation,
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Initialize defaults and calculations on mount/form change
  useEffect(() => {
    let next = initDefaults(form.components, initialData);
    next = applyCalculations(form.components, next);
    setFormData(next);
    const validationErrors = validateForm(form.components, next);
    setErrors(validationErrors);
    onValidation?.(validationErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Revalidate when data changes from external source
  useEffect(() => {
    const validationErrors = validateForm(form.components, formData);
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
    const validationErrors = validateForm(form.components, formData);
    if (validationErrors.length === 0) {
      onSubmit?.(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const getFieldError = (key: string) => errors.find(e => e.field === key)?.message;

  const renderComponent = (component: FormioComponent): React.ReactNode => {
    if (isHidden(component, formData)) return null;

    if (component.type === 'button' && component.key === 'submit') {
      return (
        <TouchableOpacity
          key={component.key}
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {component.label || 'Submit'}
          </Text>
        </TouchableOpacity>
      );
    }

    if (component.components && component.components.length) {
      const children = component.components.map(renderComponent).filter(Boolean);
      if (children.length === 0) return null;
      return (
        <View key={component.key} style={styles.container}>
          {component.label && (
            <Text style={styles.containerLabel}>{component.label}</Text>
          )}
          {children}
        </View>
      );
    }

    if (component.input === false) return null;

    // Custom component override by type
    const Custom = customComponents?.[component.type];
    if (Custom) {
      return (
        <Custom
          key={component.key}
          component={component}
          value={formData[component.key]}
          onChange={(val: any) => handleFieldChange(component.key, val)}
          error={getFieldError(component.key)}
          data={formData}
          options={options}
        />
      );
    }

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
    <ScrollView style={styles.form}>
      {form.title && <Text style={styles.title}>{form.title}</Text>}
      {form.components.map((c) => renderComponent(c))}
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