import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useI18n } from '../i18n/I18nContext';

interface CheckboxFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
  error?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  value,
  onChange,
  required,
  error
}) => {
  const { translate, isRTL } = useI18n();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onChange(!value)}
      >
        <View style={[styles.checkbox, value && styles.checkboxChecked]}>
          {value && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
          {translate(label, label)}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </TouchableOpacity>
      {error && <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>{translate(error, error)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  required: {
    color: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 32,
  },
});