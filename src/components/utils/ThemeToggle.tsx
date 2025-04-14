import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
    onClick={toggleTheme}
    className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
>
    {isDarkMode ? (
      <>
      <Sun className="h-4 w-4" />
      <span>{t('lightMode')}</span>
      </>
    ) : (
      <>
      <Moon className="h-4 w-4 text-gray-500" />
      <span>{t('darkMode')}</span>
      
      </>
    )}
    
</button>
  );
};