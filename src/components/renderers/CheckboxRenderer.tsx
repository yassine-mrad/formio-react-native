/**
 * Checkbox Component Renderer
 * 
 * Renders a checkbox input with label
 * 
 * @module components/renderers/CheckboxRenderer
 */

import React from 'react';
import { Switch, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ComponentRenderProps } from '../../registry/ComponentRegistry';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { useI18n } from '../../i18n/I18nContext';
import { getTextAlign, getFlexDirection } from '../../utils/rtlUtils';
import { getCheckboxAriaAttributes } from '../../utils/a11yUtils';

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  labelDisabled: {
    color: COLORS.disabled,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.xs,
  },
});

/**
 * CheckboxRenderer component
 * 
 * @param props Component render props
 * @returns Rendered checkbox component
 */
const CheckboxRendererComponent: React.FC<ComponentRenderProps> = ({
  component,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) => {
  const { label } = component;
  const { isRTL, translate } = useI18n();
  const isChecked = Boolean(value);

  return (
    <View style={styles.container}>
      <View style={[styles.checkboxContainer, { flexDirection: getFlexDirection(isRTL) }]}>
        <View {...getCheckboxAriaAttributes(translate(label || ''), isChecked, disabled || readOnly)}>
          <Switch
            value={isChecked}
            onValueChange={onChange}
            disabled={disabled || readOnly}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={isChecked ? COLORS.primary : COLORS.disabled}
          />
        </View>
        {label && (
          <Text
            style={[
              styles.label,
              (disabled || readOnly) && styles.labelDisabled,
              { textAlign: getTextAlign(isRTL) },
            ]}
          >
            {label}
          </Text>
        )}
      </View>
      {error && <Text style={[styles.errorText, { textAlign: getTextAlign(isRTL) }]}>{error}</Text>}
    </View>
  );
};

export const CheckboxRenderer = React.memo(CheckboxRendererComponent);
