// src/hooks/useLanguage.ts - Atualizado para incluir espanhol seguindo padrões do projeto
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  // Get current language
  const currentLanguage = i18n.language;
  
  // Detect if current language is English
  const isEnglish = currentLanguage === 'en' || currentLanguage.startsWith('en-');
  
  // Detect if current language is Portuguese
  const isPortuguese = currentLanguage === 'pt' || currentLanguage.startsWith('pt-');
  
  // Detect if current language is Spanish
  const isSpanish = currentLanguage === 'es' || currentLanguage.startsWith('es-');

  // Change language function
  const changeLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  }, [i18n]);

  // Toggle between languages (English -> Portuguese -> Spanish -> English)
  const toggleLanguage = useCallback(() => {
    let newLang = 'en';
    if (isEnglish) {
      newLang = 'pt';
    } else if (isPortuguese) {
      newLang = 'es';
    } else if (isSpanish) {
      newLang = 'en';
    }
    changeLanguage(newLang);
  }, [isEnglish, isPortuguese, isSpanish, changeLanguage]);

  // Get available languages
  const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' }
  ];

  // Get current language info
  const getCurrentLanguageInfo = () => {
    return availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];
  };

  // Ensure language is loaded from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && savedLanguage !== currentLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n, currentLanguage]);

  return {
    currentLanguage,
    isEnglish,
    isPortuguese,
    isSpanish,
    changeLanguage,
    toggleLanguage,
    availableLanguages,
    getCurrentLanguageInfo,
    t
  };
};