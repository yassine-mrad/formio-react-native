# formio-react-native

React Native renderer for Form.io forms using native components with theming and customization support.

## Installation

```bash
npm install formio-react-native @react-native-picker/picker
```

## Basic Usage

```tsx
import React from 'react';
import { FormioForm } from 'formio-react-native';

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
import { FormioProvider, FormioForm } from 'formio-react-native';

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
import { FormioProvider, ComponentRenderer } from 'formio-react-native';
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
import { useFormioContext } from 'formio-react-native';

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

### Input Components
- `textfield` / `text` - Text input
- `email` - Email input with validation
- `password` - Password input (masked) with show/hide toggle
- `number` - Numeric input with min/max constraints
- `textarea` - Multi-line text input
- `url` - URL input with URL keyboard
- `phoneNumber` - Phone number input with phone keyboard

### Selection Components
- `select` - Dropdown picker with search
- `checkbox` - Single checkbox/toggle
- `radio` - Radio button group
- `selectboxes` - Multi-select checkboxes

### Date/Time Components
- `date` - Date picker (text-based, ready for native integration)
- `datetime` - Date and time picker
- `time` - Time picker

### File Components
- `file` - File upload with callback support

### Layout Components
- `panel` - Container panel
- `columns` - Column layout
- `datagrid` - Data grid with add/remove rows
- `editgrid` - Editable grid with inline editing

### Advanced Components
- `wizard` - Multi-step wizard form
- `button` - Submit button

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

## Internationalization (i18n)

The library includes built-in support for multiple languages with automatic RTL detection.

### Supported Languages

- **English** (en) - Default
- **Arabic** (ar) - RTL
- **French** (fr)

### Basic Usage

```tsx
import { FormioProvider, FormioForm } from 'formio-react-native';

const App = () => {
  return (
    <FormioProvider
      i18n={{
        language: 'ar', // Set to Arabic
        translations: {
          // Use default translations or provide custom ones
        },
      }}
    >
      <FormioForm form={formSchema} onSubmit={handleSubmit} />
    </FormioProvider>
  );
};
```

### Custom Translations

```tsx
const customTranslations = {
  en: {
    'validation.REQUIRED': 'This field is mandatory',
    'Submit': 'Send Form',
    'First Name': 'Given Name',
  },
  ar: {
    'validation.REQUIRED': 'هذا الحقل إلزامي',
    'Submit': 'إرسال النموذج',
    'First Name': 'الاسم الأول',
  },
};

<FormioProvider
  i18n={{
    language: 'ar',
    translations: customTranslations,
  }}
>
  <FormioForm form={formSchema} onSubmit={handleSubmit} />
</FormioProvider>
```

### Language Switching

```tsx
import { useI18n } from 'formio-react-native';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();

  return (
    <View>
      <TouchableOpacity onPress={() => setLanguage('en')}>
        <Text>English</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setLanguage('ar')}>
        <Text>العربية</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setLanguage('fr')}>
        <Text>Français</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### RTL Support

RTL (Right-to-Left) is automatically enabled for Arabic and Hebrew. The library handles:

- Text direction
- Component alignment
- Icon positioning
- Margin/padding reversal

```tsx
import { useI18n } from 'formio-react-native';

const MyComponent = () => {
  const { isRTL } = useI18n();

  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      {/* Your content */}
    </View>
  );
};
```

### Translation Keys

#### Validation Messages
- `validation.REQUIRED` - Field is required
- `validation.MIN_LENGTH` - Minimum length validation
- `validation.MAX_LENGTH` - Maximum length validation
- `validation.PATTERN` - Pattern validation
- `validation.MIN_VALUE` - Minimum value validation
- `validation.MAX_VALUE` - Maximum value validation
- `validation.INVALID_EMAIL` - Email validation
- `validation.INVALID_URL` - URL validation
- `validation.INVALID_PHONE` - Phone validation
- `validation.INVALID_DATE` - Date validation
- `validation.FILE_TYPE_INVALID` - File type validation
- `validation.FILE_SIZE_TOO_LARGE` - File size validation
- `validation.CUSTOM_ERROR` - Custom validation error

#### Common UI Strings
- `Submit` - Submit button
- `Previous` - Previous button
- `Next` - Next button
- `Finish` - Finish button
- `Loading...` - Loading indicator
- `Search...` - Search placeholder
- `No options available` - Empty options message
- `Select...` - Select placeholder
- `No wizard pages found` - Wizard error message

#### Component Labels
- `First Name`, `Last Name`, `Email`, `Phone`, `Address`, `City`, `State`, `Zip Code`, `Country`
- `Message`, `Comments`, `Agree`, `Yes`, `No`, `OK`, `Cancel`, `Delete`, `Edit`, `Add`, `Remove`, `Save`, `Close`, `Done`