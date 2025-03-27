import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';

export const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label={t('darkMode')}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 dark:text-white" />
      ) : (
        <Moon className="w-5 h-5 " />
      )}
    </button>
  );
};