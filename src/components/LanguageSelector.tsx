import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
    >
      <Globe className="w-5 h-5 dark:text-white" />
      <span className='dark:text-white'>{t('language')}</span>

    </button>
  );
};