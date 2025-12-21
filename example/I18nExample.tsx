import React from 'react';
import {
  Alert,
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FormioForm, FormioProvider, useI18n } from 'formio-react-native';

const customTranslations = {
  fr: {
    'First Name': 'Prénom',
    'Enter your first name': 'Entrez votre prénom',
  },
  ar: {
    'First Name': 'الاسم الأول',
    'Enter your first name': 'أدخل اسمك الأول',
  },
  en: {
    'First Name': 'First Name',
    'Enter your first name': 'Enter your first name',
  },
};

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#18181B' : '#F3F4F6'} />
      <FormioProvider
        i18n={{
          language: 'en',
          translations: customTranslations,
          rtlLanguages: ['ar', 'he', 'fa', 'ur'],
        }}
      >
        <AppContent isDarkMode={isDarkMode} />
      </FormioProvider>
    </SafeAreaProvider>
  );
}

function AppContent({ isDarkMode }: { isDarkMode: boolean }) {
  const safeAreaInsets = useSafeAreaInsets();
  const { setLanguage, language } = useI18n();

  const handleSubmit = (data: any) => {
    Alert.alert('Form Submitted', JSON.stringify(data, null, 2));
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
          paddingLeft: safeAreaInsets.left,
          paddingRight: safeAreaInsets.right,
          backgroundColor: '#F3F4F6',
        },
      ]}
    >
      <View style={styles.flex1}>
        <LanguageSwitcher language={language} setLanguage={setLanguage} isDarkMode={isDarkMode} />
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          style={styles.flex1}
        >
          <View
      
            
          >
       
            <View >
              <FormioForm
                form={{
                  components: [
                    {
                      type: 'textfield',
                      key: 'firstName',
                      label: 'First Name',
                      placeholder: 'Enter your first name',
                      inputType: 'text',
                      validate: { required: true },
                    },
                  ],
                }}
                onSubmit={handleSubmit}
                options={{
                  // can add options to further enhance later
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function LanguageSwitcher({
  language,
  setLanguage,
  isDarkMode,
}: {
  language: string;
  setLanguage: (lang: string) => void;
  isDarkMode: boolean;
}) {
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <View style={styles.languageSwitcherContainer}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.languageButton,
            {
              backgroundColor:
                lang.code === language
                  ? (isDarkMode ? '#6366F1' : '#4338CA')
                  : (isDarkMode ? '#27272A' : '#E5E7EB'),
              borderWidth: lang.code === language ? 2 : 1,
              borderColor: lang.code === language ? '#A5B4FC' : (isDarkMode ? '#52525B' : '#D1D5DB'),
            },
          ]}
          onPress={() => setLanguage(lang.code)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.languageButtonText,
              {
                color: lang.code === language
                  ? '#fff'
                  : (isDarkMode ? '#E4E4E7' : '#1F2937'),
                fontWeight: lang.code === language ? 'bold' : 'normal',
              },
            ]}
          >
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor handled inline
  },
  flex1: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  formContainer: {
    borderRadius: 16,
    padding: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
    marginVertical: 32,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  languageSwitcherContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 8,
    alignItems: 'center',
  },
  languageButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  languageButtonText: {
    fontSize: 16,
    letterSpacing: 0.25,
  },
  formioFormWrapper: {
    marginVertical: 8,
  },
});