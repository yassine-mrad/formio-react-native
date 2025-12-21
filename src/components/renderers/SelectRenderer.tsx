/**
 * Select Component Renderer
 * 
 * Renders a dropdown/picker select field with data source support
 * 
 * @module components/renderers/SelectRenderer
 */

import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  FlatList,
} from 'react-native';
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
    marginBottom: SPACING.xs,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    minHeight: 40,
    justifyContent: 'center',
  },
  selectButtonFocused: {
    borderColor: COLORS.primary,
  },
  selectButtonError: {
    borderColor: COLORS.error,
  },
  selectButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  selectText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
  },
  selectTextPlaceholder: {
    color: COLORS.placeholder,
  },
  selectTextDisabled: {
    color: COLORS.disabled,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  closeButtonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  optionItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionItemSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  optionText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
  },
  optionTextSelected: {
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.xs,
  },
});

interface SelectOption {
  label: string;
  value: any;
}

interface SelectFieldState {
  isOpen: boolean;
  isFocused: boolean;
  options: SelectOption[];
}

/**
 * SelectRenderer component
 * 
 * @param props Component render props
 * @returns Rendered select component
 */
export const SelectRenderer: React.FC<ComponentRenderProps> = ({
  component,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
}) => {
  const [state, setState] = React.useState<SelectFieldState>({
    isOpen: false,
    isFocused: false,
    options: parseOptions(component.data?.values || component.values || []),
  });
  const {translate} = useI18n()
  const { label, placeholder } = component;
  const selectedOption = state.options.find(opt => opt.value === value);
  const displayText =  selectedOption?.label || translate(placeholder) || translate('Select an option');

  const selectButtonStyle = [
    styles.selectButton,
    state.isFocused && styles.selectButtonFocused,
    error && styles.selectButtonError,
    (disabled || readOnly) && styles.selectButtonDisabled,
  ];

  const selectTextStyle = [
    styles.selectText,
    !selectedOption && styles.selectTextPlaceholder,
    (disabled || readOnly) && styles.selectTextDisabled,
  ];

  const handleSelect = (selectedValue: any) => {
    onChange(selectedValue);
    setState(prev => ({ ...prev, isOpen: false }));
  };

  const handleOpenClose = () => {
    if (!disabled && !readOnly) {
      setState(prev => ({ 
        ...prev, 
        isOpen: !prev.isOpen,
        isFocused: !prev.isOpen,
      }));
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{ translate(label)}</Text>}
      <TouchableOpacity
        style={selectButtonStyle}
        onPress={handleOpenClose}
        disabled={disabled || readOnly}
      >
        <Text style={selectTextStyle}>{displayText}</Text>
      </TouchableOpacity>

      <Modal
        visible={state.isOpen && !disabled && !readOnly}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select'}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleOpenClose}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={state.options}
              keyExtractor={(item, idx) => String(idx)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && styles.optionItemSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

/**
 * Parse options from component data
 */
function parseOptions(data: any[]): SelectOption[] {
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
