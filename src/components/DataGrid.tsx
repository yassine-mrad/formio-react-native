import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { FormioComponent } from '../types';
import { FormioField } from './FormioField';

export interface DataGridComponent extends FormioComponent {
  type: 'datagrid';
  components: FormioComponent[]; // columns as subcomponents
  minLength?: number;
  maxLength?: number;
  validate?: FormioComponent['validate'];
}

interface Props {
  component: DataGridComponent;
  value?: Array<Record<string, any>>;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  onChange: (value: Array<Record<string, any>>) => void;
}

export const DataGrid: React.FC<Props> = ({ component, value = [], disabled, readOnly, error, onChange }) => {
  const addRow = () => {
    const row: Record<string, any> = {};
    component.components.forEach(c => { if (c.key) row[c.key] = c.defaultValue ?? undefined; });
    onChange([...value, row]);
  };

  const removeRow = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  const updateCell = (rowIndex: number, key: string, cellValue: any) => {
    const next = value.map((row, i) => i === rowIndex ? { ...row, [key]: cellValue } : row);
    onChange(next);
  };

  return (
    <View>
      {value.map((row, rIdx) => (
        <View key={rIdx} style={styles.row}>
          {component.components.map((col) => (
            <View key={col.key} style={styles.cell}>
              <FormioField
                component={col}
                value={row[col.key]}
                onChange={(k, v) => updateCell(rIdx, col.key, v)}
                error={undefined}
              />
            </View>
          ))}
          {!disabled && !readOnly && (
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeRow(rIdx)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      {!disabled && !readOnly && (
        <TouchableOpacity style={styles.addBtn} onPress={addRow}>
          <Text style={styles.addText}>Add Row</Text>
        </TouchableOpacity>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  cell: {
    marginBottom: 8,
  },
  removeBtn: {
    alignSelf: 'flex-end',
  },
  removeText: {
    color: '#e74c3c',
  },
  addBtn: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: 14,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
});
