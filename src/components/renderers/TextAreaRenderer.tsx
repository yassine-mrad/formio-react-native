/**
 * Text Area Component Renderer
 * 
 * Renders a multi-line text input field
 * 
 * @module components/renderers/TextAreaRenderer
 */

import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { ComponentRenderProps } from '../../registry/ComponentRegistry';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    minHeight: 100,
    textAlignVertical: 'top',
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
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.xs,
  },
  charCount: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});

interface TextAreaState {
  isFocused: boolean;
}

/**
 * TextAreaRenderer component
 * 
 * @param props Component render props
 * @returns Rendered text area component
 */
export const TextAreaRenderer: React.FC<ComponentRenderProps> = ({
  component,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) => {
  const [state, setState] = React.useState<TextAreaState>({ isFocused: false });
  const { label, placeholder, maxLength } = component;
  const currentLength = String(value || '').length;

  const inputStyle = [
    styles.input,
    state.isFocused && styles.inputFocused,
    error && styles.inputError,
    disabled && styles.inputDisabled,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        value={String(value || '')}
        onChangeText={onChange}
        editable={!disabled && !readOnly}
        onFocus={() => setState({ isFocused: true })}
        onBlur={() => setState({ isFocused: false })}
        multiline
        numberOfLines={4}
        maxLength={maxLength}
      />
      {maxLength && (
        <Text style={styles.charCount}>
          {currentLength} / {maxLength}
        </Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
