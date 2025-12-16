import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import type { FormioComponent } from '../types';
import { useI18n } from '../i18n/I18nContext';

export interface DateComponent extends FormioComponent {
  type: 'date' | 'datetime' | 'time';
  format?: string; // e.g. yyyy-MM-dd, HH:mm
  enableTime?: boolean;
  enableDate?: boolean;
  minDate?: string; // ISO or relative
  maxDate?: string; // ISO or relative
  validate?: FormioComponent['validate'] & {
    min?: string;
    max?: string;
  };
}

interface Props {
  component: DateComponent;
  value?: string | null;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  onChange: (value: string | null) => void;
}

/**
 * DatePicker component
 * 
 * Provides a date/time picker interface. For production use, integrate:
 * - @react-native-community/datetimepicker (recommended)
 * - react-native-date-picker
 * - react-native-modal-datetime-picker
 * 
 * This implementation provides a basic UI with manual date entry.
 * 
 * @example
 * ```tsx
 * <DatePicker
 *   component={{
 *     type: 'date',
 *     key: 'birthDate',
 *     label: 'Birth Date',
 *     format: 'yyyy-MM-dd'
 *   }}
 *   value={data.birthDate}
 *   onChange={(val) => setData({ ...data, birthDate: val })}
 * />
 * ```
 */
export const DatePicker: React.FC<Props> = ({ component, value, disabled, readOnly, error, onChange }) => {
  const [opened, setOpened] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const { translate } = useI18n();

  const handleConfirm = () => {
    onChange(inputValue || null);
    setOpened(false);
  };

  const handleCancel = () => {
    setInputValue(value || '');
    setOpened(false);
  };

  const getPlaceholder = () => {
    switch (component.type) {
      case 'time':
        return 'HH:mm';
      case 'datetime':
        return 'yyyy-MM-dd HH:mm';
      case 'date':
      default:
        return 'yyyy-MM-dd';
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.input, error && styles.inputError, (disabled || readOnly) && styles.disabled]}
        onPress={() => !disabled && !readOnly && setOpened(true)}
        disabled={disabled || readOnly}
      >
        <Text style={[styles.valueText, !value && styles.placeholder]}>
          {value || getPlaceholder()}
        </Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={opened && !disabled && !readOnly}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {translate(component.label || 'Select Date', component.label || 'Select Date')}
              </Text>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.instructionText}>
                {translate('Enter date in format:', 'Enter date in format:')} {getPlaceholder()}
              </Text>
              <Text style={styles.exampleText}>
                {translate('Example:', 'Example:')} {getExampleDate(component.type)}
              </Text>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.buttonText}>{translate('Cancel', 'Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
                <Text style={styles.buttonText}>{translate('OK', 'OK')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

function getExampleDate(type: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  switch (type) {
    case 'time':
      return `${hours}:${minutes}`;
    case 'datetime':
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    case 'date':
    default:
      return `${year}-${month}-${day}`;
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  disabled: {
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
  valueText: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
