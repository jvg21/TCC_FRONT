// src/components/LanguageDisplay.tsx

import { useLanguage } from "../../hooks/useLanguage";

export const LanguageDisplay = () => {
  const { currentLanguage } = useLanguage();
  
  const getLanguageLabel = () => {
    switch (currentLanguage) {
      case 'pt':
      case 'pt-BR':
        return 'Português';
      case 'en':
      case 'en-US':
        return 'English';
      default:
        return currentLanguage;
    }
  };
  
  return (
    <div className="text-sm font-medium">
      <span className="text-gray-500 dark:text-gray-400">
        {getLanguageLabel()}
      </span>
    </div>
  );
};