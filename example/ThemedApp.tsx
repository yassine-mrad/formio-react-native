import React from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { FormioForm, FormioProvider } from 'formio-react-native';
import { CustomTextField, CustomButton } from './CustomComponents';

// Example public API for demo (countries)
const COUNTRIES_URL = 'http://jsonplaceholder.typicode.com/todos';

const sampleForm = {
  title: 'Themed Contact Form',
  components: [
    {
      type: 'textfield',
      key: 'firstName',
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: true,
      input: true,
    },
    {
      type: 'email',
      key: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      input: true,
      validate: {
        required: true,
        pattern: '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$',
        customMessage: 'Please enter a valid email address.',
      }
    },
    {
      type: 'select',
      key: 'country',
      label: 'Country',
      placeholder: 'Select your country',
      required: true,
      input: true,
      dataSrc: 'url',
      data: {
        url: COUNTRIES_URL,
        headers: [],
      },
      valueProperty: 'id',
      selectValues: '', // The API returns a root-level array
      template: '<span>{{title}}</span>',
      searchField: 'title',
      filter: '',
    },
    {
      type: 'button',
      key: 'submit',
      label: 'Submit Form'
    }
  ]
};

export default function App() {
  const handleSubmit = (data: any) => {
    Alert.alert('Form Submitted', JSON.stringify(data, null, 2));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FormioProvider
        theme={{
          colors: {
            primary: '#3498db',
            error: '#e74c3c',
            text: '#2c3e50',
            border: '#bdc3c7',
            background: '#ecf0f1',
          },
          input: {
            borderRadius: 8,
            padding: 16,
            fontSize: 16,
          },
          label: {
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 8,
          },
        }}
        components={{
          textfield: CustomTextField,
          button: CustomButton,
        }}
      >
        <FormioForm
          form={sampleForm}
          onSubmit={handleSubmit}
        />
      </FormioProvider>
    </SafeAreaView>
  );
}