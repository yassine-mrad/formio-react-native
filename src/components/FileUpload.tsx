import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { FormioComponent } from '../types';

export interface FileComponent extends FormioComponent {
  type: 'file';
  storage?: 'base64' | 's3' | 'url' | 'fileSystem';
  fileTypes?: string[]; // mime types or extensions
  multiple?: boolean;
  validate?: FormioComponent['validate'] & {
    maxSize?: string; // e.g. 10MB
  };
}

interface Props {
  component: FileComponent;
  value?: Array<{ name: string; url?: string; base64?: string }>;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  onChange: (value: Array<{ name: string; url?: string; base64?: string }>) => void;
}

// Placeholder: Real implementation should integrate a file picker (e.g. react-native-document-picker) and storage handling.
export const FileUpload: React.FC<Props> = ({ component, value = [], disabled, readOnly, error, onChange }) => {
  const pickFile = async () => {
    if (disabled || readOnly) return;
    // Integrate document picker here
    // For now, simulate adding a placeholder file
    const next = [...value, { name: 'example.txt' }];
    onChange(next);
  };

  const removeFile = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <View>
      <View style={styles.filesRow}>
        {value.map((file, idx) => (
          <View key={idx} style={styles.fileItem}>
            {file.url || file.base64 ? (
              <Image source={{ uri: file.url || file.base64 }} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbnailPlaceholder} />
            )}
            <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
            {!disabled && !readOnly && (
              <TouchableOpacity onPress={() => removeFile(idx)} style={styles.removeButton}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      {!disabled && !readOnly && (
        <TouchableOpacity onPress={pickFile} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add File</Text>
        </TouchableOpacity>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  filesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fileItem: {
    width: 100,
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  thumbnailPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  fileName: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
  },
  removeButton: {
    marginTop: 4,
  },
  removeText: {
    color: '#e74c3c',
    fontSize: 12,
  },
  addButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
});
