import React from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { FormioForm } from 'formio-react-native';

const wizardForm = {
  title: 'Multi-Step Wizard',
  type: 'form',
  display: 'wizard',
  components: [
    {
      type: 'panel',
      key: 'page1',
      title: 'Personal Information',
      label: 'Personal Information',
      components: [
        {
          type: 'textfield',
          key: 'firstName',
          label: 'First Name',
          required: true,
          input: true
        },
        {
          type: 'textfield',
          key: 'lastName',
          label: 'Last Name',
          required: true,
          input: true
        }
      ]
    },
    {
      type: 'panel',
      key: 'page2',
      title: 'Contact Information',
      label: 'Contact Information',
      components: [
        {
          type: 'email',
          key: 'email',
          label: 'Email',
          required: true,
          input: true
        },
        {
          type: 'textfield',
          key: 'phone',
          label: 'Phone',
          input: true
        }
      ]
    },
    {
      type: 'panel',
      key: 'page3',
      title: 'Review',
      label: 'Review Your Information',
      components: [
        {
          type: 'textfield',
          key: 'comments',
          label: 'Additional Comments',
          input: true
        }
      ]
    }
  ]
};

export default function WizardExample() {
  const handleSubmit = (data: any) => {
    Alert.alert('Wizard Completed', JSON.stringify(data, null, 2));
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <FormioForm
        form={wizardForm}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}