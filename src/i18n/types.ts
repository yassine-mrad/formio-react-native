export interface I18nConfig {
  language: string;
  translations: Record<string, Record<string, string>>;
  rtlLanguages?: string[];
}

export interface I18nContextValue {
  language: string;
  isRTL: boolean;
  translate: (key: string, fallback?: string) => string;
  setLanguage: (language: string) => void;
}