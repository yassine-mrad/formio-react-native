import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { FormioComponent } from '../types';
import { FormioField } from './FormioField';

export interface EditGridComponent extends FormioComponent {
  type: 'editgrid';
  components: FormioComponent[];
  inlineEdit?: boolean;
}

interface Props {
  component: EditGridComponent;
  value?: Array<Record<string, any>>;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  onChange: (value: Array<Record<string, any>>) => void;
}

export const EditGrid: React.FC<Props> = ({ component, value = [], disabled, readOnly, error, onChange }) => {
  const [editing, setEditing] = useState<number | null>(null);

  const addRow = () => {
    const row: Record<string, any> = {};
    component.components.forEach(c => { if (c.key) row[c.key] = c.defaultValue ?? undefined; });
    onChange([...value, row]);
    setEditing(value.length);
  };

  const removeRow = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  const updateCell = (rowIndex: number, key: string, cellValue: any) => {
    const next = value.map((row, i) => i === rowIndex ? { ...row, [key]: cellValue } : row);
    onChange(next);
  };

  const finalizeRow = () => setEditing(null);

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
            <View style={styles.rowActions}>
              {editing === rIdx ? (
                <TouchableOpacity onPress={finalizeRow}><Text style={styles.actionText}>Done</Text></TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setEditing(rIdx)}><Text style={styles.actionText}>Edit</Text></TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => removeRow(rIdx)}><Text style={[styles.actionText, styles.delete]}>Delete</Text></TouchableOpacity>
            </View>
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
  rowActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionText: {
    color: '#007bff',
  },
  delete: {
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
