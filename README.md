# @formio/react-native

React Native renderer for Form.io forms using native components.

## Installation

```bash
npm install @formio/react-native @react-native-picker/picker
```

## Usage

```tsx
import React from 'react';
import { FormioForm } from '@formio/react-native';

const formSchema = {
  components: [
    {
      type: 'textfield',
      key: 'firstName',
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: true,
      input: true
    },
    {
      type: 'email',
      key: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
      input: true
    },
    {
      type: 'select',
      key: 'country',
      label: 'Country',
      data: {
        values: [
          { label: 'USA', value: 'us' },
          { label: 'Canada', value: 'ca' }
        ]
      },
      input: true
    },
    {
      type: 'button',
      key: 'submit',
      label: 'Submit'
    }
  ]
};

export default function App() {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  const handleChange = (data) => {
    console.log('Form changed:', data);
  };

  return (
    <FormioForm
      form={formSchema}
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
}
```

## Supported Field Types

- `textfield` - Text input
- `email` - Email input with validation
- `password` - Password input (masked)
- `number` - Numeric input
- `textarea` - Multi-line text input
- `select` - Dropdown picker
- `button` - Submit button

## API

### FormioForm Props

- `form` - Form.io JSON schema
- `data` - Initial form data (optional)
- `onSubmit` - Called when form is submitted with valid data
- `onChange` - Called when any field value changes
- `onValidation` - Called when validation state changes