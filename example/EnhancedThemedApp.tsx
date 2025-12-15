import React from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { FormioForm, FormioProvider, useTheme } from '@formio/react-native';

const customTheme = {
  colors: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    error: '#EF4444',
    success: '#10B981',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#D1D5DB',
    borderFocus: '#6366F1',
    disabled: '#F3F4F6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      sm: 14,
      md: 16,
      lg: 18,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      bold: '600',
    },
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
  },
  components: {
    input: {
      borderRadius: 8,
      borderWidth: 1,
      padding: 16,
      fontSize: 16,
      minHeight: 48,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    button: {
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      fontWeight: '600',
      minHeight: 48,
    },
  },
};

const sampleForm = {
  title: 'Enhanced Themed Form',
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
    },
    {
      type: 'textarea',
      key: 'message',
      label: 'Message',
      placeholder: 'Enter your message',
      input: true,
    },
    {
      type: 'button',
      key: 'submit',
      label: 'Submit Form'
    }
  ]
};

export default function EnhancedThemedApp() {
  const handleSubmit = (data: any) => {
    Alert.alert('Form Submitted', JSON.stringify(data, null, 2));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FormioProvider theme={customTheme}>
        <FormioForm
          form={sampleForm}
          onSubmit={handleSubmit}
        />
      </FormioProvider>
    </SafeAreaView>
  );
}