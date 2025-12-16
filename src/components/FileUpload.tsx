import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { FormioComponent } from '../types';
import { useI18n } from '../i18n/I18nContext';

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
  onPickFile?: () => Promise<Array<{ name: string; url?: string; base64?: string }>>;
}

/**
 * FileUpload component
 * 
 * Provides file upload functionality. For production use, integrate:
 * - react-native-document-picker (for file selection)
 * - react-native-image-picker (for image selection)
 * - AWS SDK or similar for S3 uploads
 * 
 * This implementation provides a basic UI. The actual file picking logic
 * should be provided via the onPickFile callback.
 * 
 * @example
 * ```tsx
 * import DocumentPicker from 'react-native-document-picker';
 * 
 * const handlePickFile = async () => {
 *   const result = await DocumentPicker.pick({
 *     type: [DocumentPicker.types.allFiles],
 *   });
 *   return [{
 *     name: result.name,
 *     url: result.uri,
 *   }];
 * };
 * 
 * <FileUpload
 *   component={fileComponent}
 *   value={files}
 *   onChange={setFiles}
 *   onPickFile={handlePickFile}
 * />
 * ```
 */
export const FileUpload: React.FC<Props> = ({
  component,
  value = [],
  disabled,
  readOnly,
  error,
  onChange,
  onPickFile,
}) => {
  const { translate } = useI18n();

  const pickFile = async () => {
    if (disabled || readOnly || !onPickFile) return;
    try {
      const newFiles = await onPickFile();
      const next = component.multiple ? [...value, ...newFiles] : newFiles;
      onChange(next);
    } catch (err) {
      // Handle error silently or log
      console.warn('File pick error:', err);
    }
  };

  const removeFile = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <View style={styles.container}>
      {value.length > 0 && (
        <View style={styles.filesRow}>
          {value.map((file, idx) => (
            <View key={idx} style={styles.fileItem}>
              {file.url || file.base64 ? (
                <Image source={{ uri: file.url || file.base64 }} style={styles.thumbnail} />
              ) : (
                <View style={styles.thumbnailPlaceholder}>
                  <Text style={styles.fileIcon}>📄</Text>
                </View>
              )}
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              {!disabled && !readOnly && (
                <TouchableOpacity onPress={() => removeFile(idx)} style={styles.removeButton}>
                  <Text style={styles.removeText}>{translate('Remove', 'Remove')}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
      {!disabled && !readOnly && (
        <TouchableOpacity onPress={pickFile} style={styles.addButton}>
          <Text style={styles.addButtonText}>
            {translate(component.multiple ? 'Add Files' : 'Add File', component.multiple ? 'Add Files' : 'Add File')}
          </Text>
        </TouchableOpacity>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  filesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: 32,
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
