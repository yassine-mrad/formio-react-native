/**
 * URL Field Component Renderer
 * 
 * Renders a URL input field with URL validation
 * 
 * @module components/renderers/URLRenderer
 */

import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { ComponentRenderProps } from '../../registry/ComponentRegistry';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';

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

interface URLFieldState {
  isFocused: boolean;
}

/**
 * URLRenderer component
 * 
 * @param props Component render props
 * @returns Rendered URL field component
 */
export const URLRenderer: React.FC<ComponentRenderProps> = ({
  component,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) => {
  const [state, setState] = React.useState<URLFieldState>({ isFocused: false });
  const { label, placeholder } = component;

  const inputStyle = [
    styles.input,
    state.isFocused && styles.inputFocused,
    error && styles.inputError,
    disabled && styles.inputDisabled,
  ];

  return (
    <View style={styles.container}>
      <TextInput
        style={inputStyle}
        placeholder={placeholder || 'Enter URL'}
        placeholderTextColor={COLORS.placeholder}
        value={String(value || '')}
        onChangeText={onChange}
        editable={!disabled && !readOnly}
        onFocus={() => setState({ isFocused: true })}
        onBlur={() => setState({ isFocused: false })}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};
