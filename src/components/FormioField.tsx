import React from 'react';
import { View, Text, TextInput, StyleSheet, I18nManager } from 'react-native';
import { FormioComponent } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n/I18nContext';
import { useFormioContext } from '../context/FormioContext';
import { createRegistryWithComponents } from '../registry';
import { DEFAULT_RENDERERS, FallbackRenderer } from '../components/renderers';

// Optional: If consumer installs @react-native-picker/picker we can lazy import
let Picker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Picker = require('@react-native-picker/picker').Picker;
} catch (e) {
  Picker = null;
}

interface FormioFieldProps {
  component: FormioComponent;
  value: any;
  onChange: (key: string, value: any) => void;
  error?: string;
}

const getOptions = (component: FormioComponent): Array<{ label: string; value: any }> => {
  const ds = component.data;
  if (!ds) return [];
  if (ds.values) return ds.values;
  if (ds.json && Array.isArray(ds.json)) return ds.json;
  return [];
};

export const FormioField: React.FC<FormioFieldProps> = ({ component, value, onChange, error }) => {
  const { type, key, label, placeholder, required, disabled } = component;
  const { createStyles, getColor, getComponent } = useTheme();
  const { translate, isRTL } = useI18n();
  const formioContext = useFormioContext();

  const translatedLabel = translate(label || '', label);
  const translatedPlaceholder = translate(placeholder || '', placeholder);
  const translatedError = translate(error || '', error);

  const themedStyles = createStyles((theme) => ({
    fieldContainer: {
      marginBottom: getComponent('container.marginBottom', 16),
    },
    label: {
      fontSize: getComponent('label.fontSize', 16),
      fontWeight: getComponent('label.fontWeight', '500') as any,
      marginBottom: getComponent('label.marginBottom', 8),
      color: getComponent('label.color') || getColor('text', '#333'),
      textAlign: isRTL ? 'right' : 'left',
      width: '100%'
    },
    input: {
      borderWidth: getComponent('input.borderWidth', 1),
      borderColor: error ? getColor('error', '#e74c3c') : getColor('border', '#ddd'),
      borderRadius: getComponent('input.borderRadius', 8),
      padding: getComponent('input.padding', 12),
      fontSize: getComponent('input.fontSize', 16),
      minHeight: getComponent('input.minHeight', 44),
      backgroundColor: disabled
        ? getColor('disabled', '#f0f0f0')
        : getColor('background', '#fff'),
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    errorText: {
      color: getColor('error', '#e74c3c'),
      fontSize: getComponent('error.fontSize', 14),
      marginTop: getComponent('error.marginTop', 4),
    },
  }));

  // Build a registry combining built-in renderers and any overrides from context
  const registry = React.useMemo(() => {
    const reg = createRegistryWithComponents(DEFAULT_RENDERERS as any);
    const overrides = formioContext?.componentOverrides;
    if (overrides) {
      Object.entries(overrides).forEach(([t, override]) => {
        if (override && typeof override === 'function') {
          reg.register(t, override);
        }
      });
    }
    return reg;
  }, [formioContext?.componentOverrides]);

  const renderField = () => {
    // Try to render via the registry first
    const renderer: any = registry.get(type);
    if (renderer) {
      return (
        <>{renderer({
          component,
          value,
          onChange: (val: any) => onChange(key, val),
          error: translatedError,
          disabled,
          readOnly: !!component.readOnly,
        } as any)}</>
      );
    }

    // Fallback: unknown type
    return <FallbackRenderer component={component} value={value} onChange={(v: any) => onChange(key, v)} error={translatedError} disabled={disabled} />;
  };

  if (component.input === false) return null;

  // Checkbox renders its own label
  if (type === 'checkbox') {
    return renderField();
  }

  return (
    <View style={themedStyles.fieldContainer}>
      {translatedLabel && (
        <Text style={[themedStyles.label]}>
          {translatedLabel}
          {required && <Text style={[themedStyles.required, { color: getColor('error') }]}> *</Text>}
        </Text>
      )}
      {renderField()}
      {component.description ? (
        <Text style={[themedStyles.description, { color: getColor('textSecondary'), textAlign: isRTL ? 'right' : 'left' }]}>
          {translate(component.description, component.description)}
        </Text>
      ) : null}
      {translatedError && <Text style={themedStyles.errorText}>{translatedError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  disabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectPlaceholder: {
    padding: 12,
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  description: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  radioGroup: {
    gap: 8,
  },
  radioItem: {
    fontSize: 16,
    paddingVertical: 6,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 16,
  },
});