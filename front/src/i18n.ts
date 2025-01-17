import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
import en from './locales/en.json';
import pt from './locales/pt.json';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
} as const;

i18n
  .use(LanguageDetector) // Detect language from browser
  .use(initReactI18next) // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language
    interpolation: {
      escapeValue: false, // Not needed for React
    },
  });

export default i18n;