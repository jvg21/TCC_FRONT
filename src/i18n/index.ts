// src/i18n/index.ts - Updated to use separate translation files
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enTranslations } from './translations/en';
import { ptTranslations } from './translations/pt';

// Carrega idioma do localStorage
const savedLanguage = localStorage.getItem('i18nextLng');

const resources = {
  en: {
    translation: enTranslations
  },
  pt: {
    translation: ptTranslations
  }
};

// Inicializa i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage || 'en', // Use saved language or default to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    // Enable debug in development mode
    debug: process.env.NODE_ENV === 'development',
  });

// Adiciona um listener para salvar a linguagem no localStorage quando mudar
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;