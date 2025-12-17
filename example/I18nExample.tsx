import React, { useState } from 'react';
import { SafeAreaView, Alert, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FormioForm, FormioProvider } from 'formio-react-native';

const customTranslations = {
  fr: {
    'Contact Form': 'Formulaire de Contact',
    'First Name': 'Prénom',
    'Last Name': 'Nom de famille',
    'Email Address': 'Adresse e-mail',
    'Age': 'Âge',
    'Country': 'Pays',
    'Message': 'Message',
    'Submit Form': 'Soumettre le formulaire',
    'Enter your first name': 'Entrez votre prénom',
    'Enter your last name': 'Entrez votre nom de famille',
    'Enter your email': 'Entrez votre e-mail',
    'Enter your age': 'Entrez votre âge',
    'Enter your message': 'Entrez votre message',
    'United States': 'États-Unis',
    'Canada': 'Canada',
    'United Kingdom': 'Royaume-Uni',
    'Australia': 'Australie',
    'Select...': 'Sélectionner...',
    'Loading...': 'Chargement...',
    'No options available': 'Aucune option disponible',
    'Search...': 'Rechercher...'
  },
  ar: {
    'Contact Form': 'نموذج الاتصال',
    'First Name': 'الاسم الأول',
    'Last Name': 'اسم العائلة',
    'Email Address': 'عنوان البريد الإلكتروني',
    'Age': 'العمر',
    'Country': 'البلد',
    'Message': 'الرسالة',
    'Submit Form': 'إرسال النموذج',
    'Enter your first name': 'أدخل اسمك الأول',
    'Enter your last name': 'أدخل اسم عائلتك',
    'Enter your email': 'أدخل بريدك الإلكتروني',
    'Enter your age': 'أدخل عمرك',
    'Enter your message': 'أدخل رسالتك',
    'United States': 'الولايات المتحدة',
    'Canada': 'كندا',
    'United Kingdom': 'المملكة المتحدة',
    'Australia': 'أستراليا',
    'Select...': 'اختر...',
    'Loading...': 'جاري التحميل...',
    'No options available': 'لا توجد خيارات متاحة',
    'Search...': 'بحث...'
  }
};

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

export default function I18nExample() {
  const [language, setLanguage] = useState('en');

  const handleSubmit = (data: any) => {
    Alert.alert('Form Submitted', JSON.stringify(data, null, 2));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.languageSelector}>
        <TouchableOpacity 
          style={[styles.langButton, language === 'en' && styles.activeLang]} 
          onPress={() => setLanguage('en')}
        >
          <Text style={styles.langText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.langButton, language === 'fr' && styles.activeLang]} 
          onPress={() => setLanguage('fr')}
        >
          <Text style={styles.langText}>Français</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.langButton, language === 'ar' && styles.activeLang]} 
          onPress={() => setLanguage('ar')}
        >
          <Text style={styles.langText}>العربية</Text>
        </TouchableOpacity>
      </View>
      
      <FormioProvider
        i18n={{
          language,
          translations: customTranslations
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  langButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeLang: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  langText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});