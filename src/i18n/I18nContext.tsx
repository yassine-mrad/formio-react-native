import React, { createContext, useContext, useState, ReactNode } from 'react';
import { I18nConfig, I18nContextValue } from './types';

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const DEFAULT_RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

interface I18nProviderProps {
  children: ReactNode;
  config?: I18nConfig;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, config }) => {
  const [language, setLanguage] = useState(config?.language || 'en');
  
  const rtlLanguages = config?.rtlLanguages || DEFAULT_RTL_LANGUAGES;
  const isRTL = rtlLanguages.includes(language);
  
  const translate = (key: string, fallback?: string): string => {
    if (!config?.translations) return fallback || key;
    
    const translations = config.translations[language];
    if (!translations) return fallback || key;
    
    return translations[key] || fallback || key;
  };

  const value: I18nContextValue = {
    language,
    isRTL,
    translate,
    setLanguage
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      language: 'en',
      isRTL: false,
      translate: (key: string, fallback?: string) => fallback || key,
      setLanguage: () => {}
    };
  }
  return context;
};