import React from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { CheckboxField } from './CheckboxField';
import { FormioComponent } from '../types';
import { useTheme } from '../hooks/useTheme';

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

  const themedStyles = createStyles((theme) => ({
    fieldContainer: {
      marginBottom: getComponent('container.marginBottom', 16),
    },
    label: {
      fontSize: getComponent('label.fontSize', 16),
      fontWeight: getComponent('label.fontWeight', '500') as any,
      marginBottom: getComponent('label.marginBottom', 8),
      color: getComponent('label.color') || getColor('text', '#333'),
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
    },
    errorText: {
      color: getColor('error', '#e74c3c'),
      fontSize: getComponent('error.fontSize', 14),
      marginTop: getComponent('error.marginTop', 4),
    },
  }));

  const renderField = () => {
    switch (type) {
      case 'textfield':
      case 'email':
      case 'password':
        return (
          <TextInput
            style={[themedStyles.input, disabled && styles.disabled]}
            value={value ?? ''}
            onChangeText={(text) => onChange(key, text)}
            placeholder={placeholder}
            editable={!disabled}
            secureTextEntry={type === 'password'}
            keyboardType={type === 'email' ? 'email-address' : 'default'}
          />
        );

      case 'number':
        return (
          <TextInput
            style={[themedStyles.input, disabled && styles.disabled]}
            value={value !== undefined && value !== null ? String(value) : ''}
            onChangeText={(text) => {
              const parsed = parseFloat(text);
              onChange(key, isNaN(parsed) ? undefined : parsed);
            }}
            placeholder={placeholder}
            editable={!disabled}
            keyboardType="numeric"
          />
        );

      case 'textarea':
        return (
          <TextInput
            style={[themedStyles.input, styles.textarea, disabled && styles.disabled]}
            value={value ?? ''}
            onChangeText={(text) => onChange(key, text)}
            placeholder={placeholder}
            editable={!disabled}
            multiline
            numberOfLines={4}
          />
        );

      case 'select': {
        const opts = getOptions(component);
        if (!Picker) {
          return (
            <Text style={styles.selectPlaceholder}>
              Select requires @react-native-picker/picker. Options: {opts.map(o => o.label).join(', ')}
            </Text>
          );
        }
        const selected = value ?? (opts.length ? opts[0].value : undefined);
        return (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selected}
              onValueChange={(v: any) => onChange(key, v)}
              enabled={!disabled}
            >
              {opts.map((o) => (
                <Picker.Item key={String(o.value)} label={o.label} value={o.value} />
              ))}
            </Picker>
          </View>
        );
      }

      case 'radio': {
        const opts = getOptions(component);
        return (
          <View style={styles.radioGroup}>
            {opts.map((o) => (
              <Text key={String(o.value)} style={styles.radioItem} onPress={() => onChange(key, o.value)}>
                {value === o.value ? '◉' : '◯'} {o.label}
              </Text>
            ))}
          </View>
        );
      }

      case 'checkbox':
        return (
          <CheckboxField
            label={label || ''}
            value={!!value}
            onChange={(checked) => onChange(key, checked)}
            required={required}
            error={error}
          />
        );

      case 'switch':
        return (
          <View style={styles.switchRow}>
            <Switch
              value={!!value}
              onValueChange={(v) => onChange(key, v)}
              disabled={disabled}
            />
            <Text style={styles.switchLabel}>{label}</Text>
          </View>
        );

      default:
        return null;
    }
  };

  if (component.input === false) return null;

  // Checkbox renders its own label
  if (type === 'checkbox') {
    return renderField();
  }

  return (
    <View style={themedStyles.fieldContainer}>
      {label && (
        <Text style={themedStyles.label}>
          {label}
          {required && <Text style={[styles.required, { color: getColor('error') }]}> *</Text>}
        </Text>
      )}
      {renderField()}
      {component.description ? (
        <Text style={[styles.description, { color: getColor('textSecondary') }]}>{component.description}</Text>
      ) : null}
      {error && <Text style={themedStyles.errorText}>{error}</Text>}
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