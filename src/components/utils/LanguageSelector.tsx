// src/components/LanguageSelector.tsx
import { Globe } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const LanguageSelector = () => {
  const { toggleLanguage, t, currentLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
      aria-label={t('changeLanguage')}
    >
      <Globe className="w-5 h-5 dark:text-white" />
      <span className="dark:text-white">
        {currentLanguage === 'pt' ? 'PT' : 'EN'}
      </span>
    </button>
  );
};