import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { FormioComponent } from '../types';

export interface DateComponent extends FormioComponent {
  type: 'date' | 'datetime' | 'time';
  format?: string; // e.g. yyyy-MM-dd, HH:mm
  enableTime?: boolean;
  enableDate?: boolean;
  minDate?: string; // ISO or relative
  maxDate?: string; // ISO or relative
  validate?: FormioComponent['validate'] & {
    min?: string;
    max?: string;
  };
}

interface Props {
  component: DateComponent;
  value?: string | null;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  onChange: (value: string | null) => void;
}

// Placeholder implementation using system pickers could be added via community libs (e.g. @react-native-community/datetimepicker)
export const DatePicker: React.FC<Props> = ({ component, value, disabled, readOnly, error, onChange }) => {
  const [opened, setOpened] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={[styles.input, error && styles.inputError, (disabled || readOnly) && styles.disabled]}
        onPress={() => !disabled && !readOnly && setOpened(true)}
        disabled={disabled || readOnly}
      >
        <Text style={styles.valueText}>{value || 'Select date/time'}</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {/* NOTE: integrate @react-native-community/datetimepicker here as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  disabled: {
    backgroundColor: '#f0f0f0',
  },
  valueText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
});
