/**
 * Selectboxes Component Renderer
 * 
 * Renders multiple checkboxes for multi-select options
 * 
 * @module components/renderers/SelectboxesRenderer
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ComponentRenderProps } from '../../registry/ComponentRegistry';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { useI18n } from '../../i18n/I18nContext';

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  checkboxGroup: {
    gap: SPACING.sm,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  checkboxSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkboxDisabled: {
    borderColor: COLORS.disabled,
    backgroundColor: COLORS.disabled,
  },
  checkmark: {
    fontSize: 14,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    flex: 1,
  },
  checkboxLabelDisabled: {
    color: COLORS.disabled,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.sm,
  },
});

interface SelectboxOption {
  label: string;
  value: any;
}

/**
 * SelectboxesRenderer component
 * 
 * @param props Component render props
 * @returns Rendered selectboxes component
 */
export const SelectboxesRenderer: React.FC<ComponentRenderProps> = ({
  component,
  value = {},
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) => {
  const { label } = component;
  const options = parseOptions(component.data?.values || component.values || []);

  // Value is an object like { option1: true, option2: false }
  const selectedValues = value || {};

  const handleToggle = (optionValue: any) => {
    if (disabled || readOnly) return;
    
    const newValue = {
      ...selectedValues,
      [String(optionValue)]: !selectedValues[String(optionValue)],
    };
    onChange(newValue);
  };
  const {translate} = useI18n()
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{translate(label)}</Text>}
      <View style={styles.checkboxGroup}>
        {options.map((option) => {
          const isSelected = selectedValues[String(option.value)];
          return (
            <TouchableOpacity
              key={String(option.value)}
              style={styles.checkboxItem}
              onPress={() => handleToggle(option.value)}
              disabled={disabled || readOnly}
            >
              <View
                style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                  (disabled || readOnly) && styles.checkboxDisabled,
                ]}
              >
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text
                style={[
                  styles.checkboxLabel,
                  (disabled || readOnly) && styles.checkboxLabelDisabled,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

/**
 * Parse options from component data
 */
function parseOptions(data: any[]): SelectboxOption[] {
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
