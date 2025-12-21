/**
 * Radio Button Component Renderer
 * 
 * Renders a radio button group for single-select options
 * 
 * @module components/renderers/RadioRenderer
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ComponentRenderProps } from '../../registry/ComponentRegistry';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { useI18n } from '../../i18n/I18nContext';
import { getTextAlign, getFlexDirection } from '../../utils/rtlUtils';
import { getRadioAriaAttributes } from '../../utils/a11yUtils';

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  radioGroup: {
    gap: SPACING.sm,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  radioButtonDisabled: {
    borderColor: COLORS.disabled,
    backgroundColor: COLORS.disabled,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.background,
  },
  radioLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    flex: 1,
  },
  radioLabelDisabled: {
    color: COLORS.disabled,
  },

});

interface RadioOption {
  label: string;
  value: any;
}

/**
 * RadioRenderer component
 *
 * @param props Component render props
 * @returns Rendered radio button group
 */
const RadioRendererComponent: React.FC<ComponentRenderProps> = ({
  component,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) => {

  const { isRTL,translate } = useI18n();
  const options = parseOptions(component.data?.values || component.values || []);

  return (
    <View style={styles.container}>

      <View style={[styles.radioGroup, { flexDirection: getFlexDirection(isRTL) }]}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={String(option.value)}
            style={styles.radioItem}
            onPress={() => !disabled && !readOnly && onChange(option.value)}
            disabled={disabled || readOnly}
            {...getRadioAriaAttributes(option.label, value === option.value, disabled || readOnly)}
          >
            <View
              style={[
                styles.radioButton,
                value === option.value && styles.radioButtonSelected,
                (disabled || readOnly) && styles.radioButtonDisabled,
              ]}
            >
              {value === option.value && <View style={styles.radioInner} />}
            </View>
            <Text
              style={[
                styles.radioLabel,
                (disabled || readOnly) && styles.radioLabelDisabled,
                { textAlign: getTextAlign(isRTL) },
              ]}
            >
              {translate(option.label)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

/**
 * Parse options from component data
 */
function parseOptions(data: any[]): RadioOption[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(item => {
    if (typeof item === 'string') {
      return { label: item, value: item };
    }
    if (typeof item === 'object' && item !== null) {
      return {
        label: item.label || String(item.value),
        value: item.value,
      };
    }
    return { label: String(item), value: item };
  });
}

export const RadioRenderer = React.memo(RadioRendererComponent);
