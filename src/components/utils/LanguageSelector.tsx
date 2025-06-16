// src/components/utils/LanguageSelector.tsx - Seguindo padrões do projeto
import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const LanguageSelector = () => {
  const { changeLanguage, t, currentLanguage, availableLanguages } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getCurrentLanguageDisplay = () => {
    switch (currentLanguage) {
      case 'pt':
        return 'PT';
      case 'es':
        return 'ES';
      case 'en':
      default:
        return 'EN';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
        aria-label={t('changeLanguage')}
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium">
          {getCurrentLanguageDisplay()}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                  currentLanguage === lang.code 
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{lang.nativeName}</span>
                {currentLanguage === lang.code && (
                  <span className="text-blue-600 dark:text-blue-300">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};