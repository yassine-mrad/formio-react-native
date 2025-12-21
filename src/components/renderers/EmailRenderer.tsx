/**
 * Email Field Component Renderer
 * 
 * Renders an email input field with built-in email validation
 * 
 * @module components/renderers/EmailRenderer
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

interface EmailFieldState {
  isFocused: boolean;
}

/**
 * EmailRenderer component
 * 
 * @param props Component render props
 * @returns Rendered email field component
 */
export const EmailRenderer: React.FC<ComponentRenderProps> = ({
  component,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) => {
  const [state, setState] = React.useState<EmailFieldState>({ isFocused: false });
  const {  placeholder } = component;
  const {translate} = useI18n();
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
        placeholder={translate(placeholder) || translate('Enter email address')}
        placeholderTextColor={COLORS.placeholder}
        value={String(value || '')}
        onChangeText={onChange}
        editable={!disabled && !readOnly}
        onFocus={() => setState({ isFocused: true })}
        onBlur={() => setState({ isFocused: false })}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
      />
    </View>
  );
};
