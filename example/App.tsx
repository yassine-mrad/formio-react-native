import React from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { FormioForm } from 'formio-react-native';

const sampleForm = {
  title: 'Contact Form',
  components: [
    {
      type: 'textfield',
      key: 'firstName',
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: true,
      input: true,
      validate: {
        required: true,
        minLength: 2
      }
    },
    {
      type: 'textfield',
      key: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter your last name',
      required: true,
      input: true
    },
    {
      type: 'email',
      key: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      input: true
    },
    {
      type: 'number',
      key: 'age',
      label: 'Age',
      placeholder: 'Enter your age',
      input: true
    },
    {
      type: 'select',
      key: 'country',
      label: 'Country',
      required: true,
      input: true,
      data: {
        values: [
          { label: 'United States', value: 'us' },
          { label: 'Canada', value: 'ca' },
          { label: 'United Kingdom', value: 'uk' },
          { label: 'Australia', value: 'au' }
        ]
      }
    },
    {
      type: 'textarea',
      key: 'message',
      label: 'Message',
      placeholder: 'Enter your message',
      input: true
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

  const handleChange = (data: any) => {
    console.log('Form data changed:', data);
  };

  const handleValidation = (errors: any[]) => {
    console.log('Validation errors:', errors);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FormioForm
        form={sampleForm}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onValidation={handleValidation}
      />
    </SafeAreaView>
  );
}