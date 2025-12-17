import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ComponentRenderer } from 'formio-react-native';

// Example custom text field with different styling
export const CustomTextField: ComponentRenderer = (component, props) => {
  return (
    <View style={customStyles.container}>
      <Text style={customStyles.label}>{component.label}</Text>
      <TextInput
        style={customStyles.input}
        value={props.value || ''}
        onChangeText={props.onChange}
        placeholder={component.placeholder}
        editable={!props.disabled}
      />
      {props.error && <Text style={customStyles.error}>{props.error}</Text>}
    </View>
  );
};

// Example custom button with gradient-like styling
export const CustomButton: ComponentRenderer = (component, props) => {
  return (
    <TouchableOpacity
      style={customStyles.button}
      onPress={() => {
        // Handle submit or other actions
        if (component.key === 'submit') {
          // Trigger form submission
        }
      }}
      disabled={props.disabled}
    >
      <Text style={customStyles.buttonText}>{component.label}</Text>
    </TouchableOpacity>
  );
};

const customStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#ecf0f1',
  },
  error: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});