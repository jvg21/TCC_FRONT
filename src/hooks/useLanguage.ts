// src/hooks/useLanguage.ts
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

  // Change language function
  const changeLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  }, [i18n]);

  // Toggle between English and Portuguese
  const toggleLanguage = useCallback(() => {
    const newLang = isEnglish ? 'pt' : 'en';
    changeLanguage(newLang);
  }, [isEnglish, changeLanguage]);

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
    changeLanguage,
    toggleLanguage,
    t
  };
};