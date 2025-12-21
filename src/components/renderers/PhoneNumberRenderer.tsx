/**
 * Phone Number Field Component Renderer
 * 
 * Renders a phone number input field with phone keyboard
 * 
 * @module components/renderers/PhoneNumberRenderer
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

interface PhoneNumberFieldState {
  isFocused: boolean;
}

/**
 * PhoneNumberRenderer component
 * 
 * @param props Component render props
 * @returns Rendered phone number field component
 */
export const PhoneNumberRenderer: React.FC<ComponentRenderProps> = ({
  component,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) => {
  const [state, setState] = React.useState<PhoneNumberFieldState>({ isFocused: false });
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
        placeholder={translate(placeholder) || translate('Enter phone number')  }
        placeholderTextColor={COLORS.placeholder}
        value={String(value || '')}
        onChangeText={onChange}
        editable={!disabled && !readOnly}
        onFocus={() => setState({ isFocused: true })}
        onBlur={() => setState({ isFocused: false })}
        keyboardType="phone-pad"
        autoCapitalize="none"
        autoCorrect={false}
      />
      
    </View>
  );
};
