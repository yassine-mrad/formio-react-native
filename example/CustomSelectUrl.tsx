import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert, View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet } from 'react-native';
import { FormioForm, FormioProvider, ComponentRenderer } from 'formio-react-native';

const CustomSelect: ComponentRenderer = (component, props) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get options from different data sources
  const getOptions = () => {
    const data = component.data;
    if (!data) return [];
    
    // Static values
    if (data.values) return data.values;
    
    // JSON data
    if (data.json && Array.isArray(data.json)) return data.json;
    
    // URL data (handled in useEffect)
    return items;
  };

  useEffect(() => {
    const data = component.data;
    
    // Handle URL data source
    if (data?.url) {
      setLoading(true);
      fetch(data.url)
        .then(res => res.json())
        .then(response => {
          const dataArray = Array.isArray(response) ? response : response.data || [];
          const mapped = dataArray.map((item: any) => ({
            label: item[data.labelProperty || 'title'] || item.name || item.label || String(item),
            value: item[data.valueProperty || 'id'] || item.value || item
          }));
          setItems(mapped);
        })
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }
    // Handle static data
    else {
      const options = getOptions();
      setItems(options);
    }
  }, [component.data]);

  const options = getOptions();
  const filteredItems = options.filter((item: any) => 
    item.label?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedItem = options.find((item: any) => item.value === props.value);

  if (props.disabled || props.readOnly) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{component.label}</Text>
        <View style={[styles.selector, styles.disabled]}>
          <Text style={styles.selectorText}>
            {selectedItem?.label || component.placeholder || 'Select...'}
          </Text>
        </View>
        {props.error && <Text style={styles.error}>{props.error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {component.label}
        {component.required && <Text style={styles.required}> *</Text>}
      </Text>
      <TouchableOpacity 
        style={[styles.selector, props.error && styles.selectorError]}
        onPress={() => setShowList(!showList)}
      >
        <Text style={[styles.selectorText, !selectedItem && styles.placeholder]}>
          {loading ? 'Loading...' : (selectedItem?.label || component.placeholder || 'Select...')}
        </Text>
        <Text style={styles.arrow}>{showList ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      
      {showList && (
        <View style={styles.dropdown}>
          {options.length > 5 && (
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
            />
          )}
          <FlatList
            data={filteredItems}
            keyExtractor={(item: any) => String(item.value)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.item, item.value === props.value && styles.selectedItem]}
                onPress={() => {
                  props.onChange(item.value);
                  setShowList(false);
                  setSearch('');
                }}
              >
                <Text style={[styles.itemText, item.value === props.value && styles.selectedText]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {loading ? 'Loading...' : 'No options available'}
              </Text>
            }
          />
        </View>
      )}
      {props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  );
};

const selectForm = {
  title: 'Custom Select Examples',
  components: [
    {
      type: 'select',
      key: 'staticSelect',
      label: 'Static Options',
      placeholder: 'Choose an option',
      required: true,
      input: true,
      data: {
        values: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' }
        ]
      }
    },
    {
      type: 'select',
      key: 'urlSelect',
      label: 'URL Data Source',
      placeholder: 'Choose a todo',
      required: true,
      input: true,
      data: {
        url: 'https://jsonplaceholder.typicode.com/todos',
        labelProperty: 'title',
        valueProperty: 'id'
      }
    },
    {
      type: 'select',
      key: 'jsonSelect',
      label: 'JSON Data',
      placeholder: 'Choose a country',
      input: true,
      data: {
        json: [
          { label: 'United States', value: 'us' },
          { label: 'Canada', value: 'ca' },
          { label: 'United Kingdom', value: 'uk' }
        ]
      }
    },
    {
      type: 'button',
      key: 'submit',
      label: 'Submit'
    }
  ]
};

export default function CustomSelectExample() {
  const handleSubmit = (data: any) => {
    Alert.alert('Form Submitted', JSON.stringify(data, null, 2));
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <FormioProvider
        components={{
          select: CustomSelect
        }}
      >
        <FormioForm
          form={selectForm}
          onSubmit={handleSubmit}
        />
      </FormioProvider>
    </SafeAreaView>
  );
}

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