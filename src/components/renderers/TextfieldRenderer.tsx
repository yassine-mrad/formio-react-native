/**
 * Text Field Component Renderer
 * 
 * Renders a simple text input field with validation support
 * 
 * @module components/renderers/TextfieldRenderer
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

interface TextFieldState {
  isFocused: boolean;
}

/**
 * TextfieldRenderer component
 * 
 * @param props Component render props
 * @returns Rendered text field component
 */
export const TextfieldRenderer: React.FC<ComponentRenderProps> = ({
  component,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) => {
  const [state, setState] = React.useState<TextFieldState>({ isFocused: false });
  const { placeholder, type = 'text' } = component;

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
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        value={String(value || '')}
        onChangeText={onChange}
        editable={!disabled && !readOnly}
        onFocus={() => setState({ isFocused: true })}
        onBlur={() => setState({ isFocused: false })}
        keyboardType={getKeyboardType(type)}
        secureTextEntry={type === 'password'}
        autoCapitalize={getAutoCapitalize(type)}
        autoCorrect={type !== 'email' && type !== 'url'}
      />
    </View>
  );
};

/**
 * Get keyboard type based on input type
 */
function getKeyboardType(type: string): any {
  const keyboardMap: Record<string, any> = {
    email: 'email-address',
    url: 'url',
    number: 'numeric',
    tel: 'phone-pad',
    text: 'default',
  };
  return keyboardMap[type] || 'default';
}

/**
 * Get auto-capitalize setting based on input type
 */
function getAutoCapitalize(type: string): 'none' | 'sentences' | 'words' | 'characters' {
  const capitalizeMap: Record<string, 'none' | 'sentences' | 'words' | 'characters'> = {
    email: 'none',
    url: 'none',
    text: 'sentences',
  };
  return capitalizeMap[type] || 'none';
}
