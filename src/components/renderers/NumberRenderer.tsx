/**
 * Number Field Component Renderer
 * 
 * Renders a numeric input field with optional min/max constraints
 * 
 * @module components/renderers/NumberRenderer
 */

import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { ComponentRenderProps } from '../../registry/ComponentRegistry';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { useI18n } from '../../i18n/I18nContext';

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    minHeight: 40,
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputDisabled: {
    backgroundColor: COLORS.disabled,
    color: COLORS.disabled,
  },

});

interface NumberFieldState {
  isFocused: boolean;
}

/**
 * NumberRenderer component
 * 
 * @param props Component render props
 * @returns Rendered number field component
 */
export const NumberRenderer: React.FC<ComponentRenderProps> = ({
  component,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) => {
  const [state, setState] = React.useState<NumberFieldState>({ isFocused: false });
  const { placeholder, min, max,  } = component;
  const {translate} = useI18n();
  const inputStyle = [
    styles.input,
    state.isFocused && styles.inputFocused,
    error && styles.inputError,
    disabled && styles.inputDisabled,
  ];

  const handleChange = (text: string) => {
    // Allow empty string to clear field
    if (text === '') {
      onChange(null);
      return;
    }

    const numValue = parseFloat(text);
    if (!isNaN(numValue)) {
      // Apply min/max constraints if provided
      let constrainedValue = numValue;
      if (min !== undefined && constrainedValue < min) {
        constrainedValue = min;
      }
      if (max !== undefined && constrainedValue > max) {
        constrainedValue = max;
      }
      onChange(constrainedValue);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={inputStyle}
        placeholder={translate(placeholder) || translate('Enter a number')}
        placeholderTextColor={COLORS.placeholder}
        value={value !== null && value !== undefined ? String(value) : ''}
        onChangeText={handleChange}
        editable={!disabled && !readOnly}
        onFocus={() => setState({ isFocused: true })}
        onBlur={() => setState({ isFocused: false })}
        keyboardType="decimal-pad"
      />
    </View>
  );
};
