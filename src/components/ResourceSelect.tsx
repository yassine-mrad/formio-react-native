import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import type { FormioComponent } from '../types';

export interface ResourceSelectComponent extends FormioComponent {
  type: 'select';
  data?: FormioComponent['data'] & {
    dataSrc: 'url' | 'resource';
    url?: string;
    resource?: string;
    searchField?: string; // query param or field name
  };
  searchEnabled?: boolean;
  debounce?: number;
  placeholder?: string;
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

export const ResourceSelect: React.FC<Props> = ({ component, value, disabled, readOnly, error, onChange, fetcher }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Array<{ label: string; value: any }>>([]);

  const debounce = component.debounce ?? 300;
  const searchEnabled = component.searchEnabled ?? true;

  useEffect(() => {
    if (!component.data || (component.data.dataSrc !== 'url' && component.data.dataSrc !== 'resource')) return;

    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const base = component.data.url || '';
        const sep = base.includes('?') ? '&' : '?';
        const q = query ? `${sep}${component.data?.searchField || 'search'}=${encodeURIComponent(query)}` : '';
        const url = `${base}${q}`;
        const res = fetcher ? await fetcher(url) : await fetch(url, { signal: controller.signal }).then(r => r.json());
        const arr = Array.isArray(res) ? res : (res?.items || res?.data || []);
        const mapped = arr.map((it: any) => ({ label: String(it.label ?? it.name ?? it.title ?? it._id ?? it.id), value: it._id ?? it.id ?? it }));
        setItems(mapped);
      } catch (e) {
        if ((e as any).name !== 'AbortError') {
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(run, debounce);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [query, component.data?.url, component.data?.resource, component.data?.searchField, debounce, fetcher]);

  return (
    <View>
      {searchEnabled && !disabled && !readOnly && (
        <TextInput
          style={styles.input}
          placeholder={component.placeholder || 'Search'}
          value={query}
          onChangeText={setQuery}
        />
      )}
      {loading ? (
        <ActivityIndicator />)
      : (
        <View style={styles.list}>
          {items.map((it, idx) => (
            <TouchableOpacity key={idx} style={styles.item} onPress={() => onChange(it.value)} disabled={disabled || readOnly}>
              <Text style={styles.itemText}>{it.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  list: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
});
