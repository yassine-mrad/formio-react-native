/**
 * Password Field Component Renderer
 * 
 * Renders a password input field with show/hide toggle
 * 
 * @module components/renderers/PasswordRenderer
 */

import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ComponentRenderProps } from '../../registry/ComponentRegistry';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  inputWrapperDisabled: {
    backgroundColor: COLORS.disabled,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    minHeight: 40,
  },
  toggleButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  toggleText: {
    fontSize: 18,
    color: COLORS.primary,
  },

});

interface PasswordFieldState {
  isFocused: boolean;
  showPassword: boolean;
}

/**
 * PasswordRenderer component
 * 
 * @param props Component render props
 * @returns Rendered password field component
 */
export const PasswordRenderer: React.FC<ComponentRenderProps> = ({
  component,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) => {
  const [state, setState] = useState<PasswordFieldState>({
    isFocused: false,
    showPassword: false,
  });
  const { placeholder } = component;

  const inputWrapperStyle = [
    styles.inputWrapper,
    state.isFocused && styles.inputWrapperFocused,
    error && styles.inputWrapperError,
    disabled && styles.inputWrapperDisabled,
  ];

  return (
    <View style={styles.container}>
      <View style={inputWrapperStyle}>
        <TextInput
          style={styles.input}
          placeholder={placeholder || 'Enter password'}
          placeholderTextColor={COLORS.placeholder}
          value={String(value || '')}
          onChangeText={onChange}
          editable={!disabled && !readOnly}
          onFocus={() => setState(prev => ({ ...prev, isFocused: true }))}
          onBlur={() => setState(prev => ({ ...prev, isFocused: false }))}
          secureTextEntry={!state.showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
          disabled={disabled || readOnly}
        >
          <Text style={styles.toggleText}>
            {state.showPassword ? '🐵' : '🙈'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
