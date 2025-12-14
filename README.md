# @formio/react-native

React Native renderer for Form.io forms using native components with theming and customization support.

## Installation

```bash
npm install @formio/react-native @react-native-picker/picker
```

## Basic Usage

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

  return (
    <FormioForm
      form={formSchema}
      onSubmit={handleSubmit}
    />
  );
}
```

## Theming and Customization

### Using FormioProvider for Global Theming

```tsx
import React from 'react';
import { FormioProvider, FormioForm } from '@formio/react-native';

const App = () => {
  return (
    <FormioProvider
      theme={{
        colors: {
          primary: '#007AFF',
          error: '#FF3B30',
          border: '#C7C7CC',
          text: '#000',
          background: '#fff',
        },
        input: {
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
        },
        label: {
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 8,
        },
      }}
    >
      <FormioForm form={formSchema} onSubmit={handleSubmit} />
    </FormioProvider>
  );
};
```

### Custom Component Overrides

```tsx
import React from 'react';
import { FormioProvider, ComponentRenderer } from '@formio/react-native';
import { TextInput, Text, View } from 'react-native';

const CustomTextField: ComponentRenderer = (component, props) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        {component.label}
      </Text>
      <TextInput
        style={{
          borderWidth: 2,
          borderColor: '#3498db',
          borderRadius: 12,
          padding: 16,
          backgroundColor: '#ecf0f1',
        }}
        value={props.value || ''}
        onChangeText={props.onChange}
        placeholder={component.placeholder}
      />
      {props.error && (
        <Text style={{ color: '#e74c3c', marginTop: 4 }}>
          {props.error}
        </Text>
      )}
    </View>
  );
};

const App = () => {
  return (
    <FormioProvider
      components={{
        textfield: CustomTextField,
      }}
    >
      <FormioForm form={formSchema} onSubmit={handleSubmit} />
    </FormioProvider>
  );
};
```

### Per-Form Component Overrides

```tsx
// Override components for specific forms
<FormioForm
  form={formSchema}
  components={{
    email: CustomEmailField, // Only for this form
  }}
  onSubmit={handleSubmit}
/>
```

### Dynamic Component Registration

```tsx
import { useFormioContext } from '@formio/react-native';

const MyComponent = () => {
  const { registerComponent } = useFormioContext();

  useEffect(() => {
    registerComponent('customWidget', (component, props) => (
      <CustomWidget {...component} {...props} />
    ));
  }, []);

  return <FormioForm form={schema} />;
};
```

## Supported Field Types

- `textfield` - Text input
- `email` - Email input with validation
- `password` - Password input (masked)
- `number` - Numeric input
- `textarea` - Multi-line text input
- `select` - Dropdown picker
- `checkbox` - Checkbox input
- `radio` - Radio button group
- `button` - Submit button
- `date` - Date picker
- `file` - File upload
- `datagrid` - Data grid
- `editgrid` - Editable grid
- `wizard` - Multi-step wizard
- `panel` - Container panel
- `columns` - Column layout

## API

### FormioForm Props

- `form` - Form.io JSON schema
- `data` - Initial form data (optional)
- `components` - Component overrides for this form
- `onSubmit` - Called when form is submitted with valid data
- `onChange` - Called when any field value changes
- `onValidation` - Called when validation state changes

### FormioProvider Props

- `theme` - Global theme configuration
- `components` - Global component overrides
- `children` - React children

### ComponentRenderer Type

```tsx
type ComponentRenderer = (
  component: FormioComponent,
  props: ComponentRenderProps
) => ReactNode;

interface ComponentRenderProps {
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  formData?: Record<string, any>;
}
```

## Override Precedence

1. **Form-level components** (via `components` prop) - Highest priority
2. **Context components** (via `FormioProvider`) - Medium priority
3. **Built-in components** - Lowest priority (fallback)

This allows you to set global defaults while still overriding specific forms when needed.