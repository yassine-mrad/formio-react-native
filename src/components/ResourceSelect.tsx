import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import type { FormioComponent } from '../types';

export interface ResourceSelectComponent extends FormioComponent {
  type: 'select';
  data?: FormioComponent['data'] & {
    dataSrc?: 'url' | 'resource' | 'values' | 'json';
    url?: string;
    resource?: string;
    searchField?: string;
    values?: Array<{ label: string; value: any }>;
    json?: Array<{ label: string; value: any }>;
    labelProperty?: string;
    valueProperty?: string;
  };
  searchEnabled?: boolean;
  debounce?: number;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

interface Props {
  component: ResourceSelectComponent;
  value: any;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  onChange: (value: any) => void;
  fetcher?: (url: string) => Promise<any>;
}

export const ResourceSelect: React.FC<Props> = ({
  component,
  value,
  disabled,
  readOnly,
  error,
  onChange,
  fetcher
}) => {
  const [items, setItems] = useState<Array<{ label: string; value: any }>>([]);
  const [search, setSearch] = useState('');
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  const getOptions = () => {
    const data = component.data;
    if (!data) return [];
    if (data.values) return data.values;
    if (data.json && Array.isArray(data.json)) return data.json;
    return items;
  };

  useEffect(() => {
    const data = component.data;
    if (data && (data.dataSrc === 'url' || data.dataSrc === 'resource' || data.url)) {
      setLoading(true);
      const doFetch = async () => {
        try {
          let base = data.url ?? '';
          let labelProp = data.labelProperty || 'title';
          let valueProp = data.valueProperty || 'id';
          let sep = base.includes('?') ? '&' : '?';
          let q = search
            ? `${sep}${data.searchField || 'search'}=${encodeURIComponent(search)}`
            : '';
          let url = `${base}${q}`;
          const res = fetcher
            ? await fetcher(url)
            : await fetch(url).then((r) => r.json());
          const dataArray = Array.isArray(res)
            ? res
            : res.data || res.items || [];
          const mapped = dataArray.map((item: any) => ({
            label:
              item[labelProp] ||
              item.name ||
              item.label ||
              item.title ||
              item._id ||
              item.id ||
              String(item),
            value: item[valueProp] || item._id || item.id || item.value || item
          }));
          setItems(mapped);
        } catch (err) {
          setItems([]);
        } finally {
          setLoading(false);
        }
      };
      doFetch();
    } else {
      setItems(getOptions());
    }
  }, [component.data, search, fetcher]);

  const options = getOptions();
  const filteredItems =
    options && Array.isArray(options)
      ? options.filter(
          (item: any) =>
            (item.label || '')
              .toLowerCase()
              .includes((search || '').toLowerCase())
        )
      : [];

  const selectedItem = options.find((item: any) => item.value === value);

  if (disabled || readOnly) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{component.label}</Text>
        <View style={[styles.selector, styles.disabled]}>
          <Text style={styles.selectorText}>
            {selectedItem?.label || component.placeholder || 'Select...'}
          </Text>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  const useSearch = (component.searchEnabled ?? true) && options.length > 5;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {component.label}
        {component.required && <Text style={styles.required}> *</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.selector, error && styles.selectorError]}
        onPress={() => setShowList(!showList)}
        disabled={disabled || readOnly}
      >
        <Text style={[styles.selectorText, !selectedItem && styles.placeholder]}>
          {loading
            ? 'Loading...'
            : selectedItem?.label || component.placeholder || 'Select...'}
        </Text>
        <Text style={styles.arrow}>{showList ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {showList && (
        <View style={styles.dropdown}>
          {useSearch && (
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
              autoFocus
              editable={!disabled && !readOnly}
            />
          )}
          {loading ? (
            <ActivityIndicator style={{ margin: 12 }} />
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item: any, i) =>
                String(`${item.value}-${item.label}-${i}`)
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    item.value === value && styles.selectedItem
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    setShowList(false);
                    setSearch('');
                  }}
                >
                  <Text
                    style={[
                      styles.itemText,
                      item.value === value && styles.selectedText
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {loading ? 'Loading...' : 'No options available'}
                </Text>
              }
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  required: { color: '#e74c3c' },
  selector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectorError: { borderColor: '#e74c3c' },
  disabled: { backgroundColor: '#f5f5f5', opacity: 0.6 },
  selectorText: { fontSize: 16, color: '#333', flex: 1 },
  placeholder: { color: '#999' },
  arrow: { fontSize: 12, color: '#666' },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 200,
    marginTop: 4
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 12,
    fontSize: 16
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  selectedItem: { backgroundColor: '#e3f2fd' },
  itemText: { fontSize: 16, color: '#333' },
  selectedText: { fontWeight: '600', color: '#1976d2' },
  emptyText: { padding: 12, textAlign: 'center', color: '#999', fontStyle: 'italic' },
  error: { color: '#e74c3c', fontSize: 14, marginTop: 4 }
});
