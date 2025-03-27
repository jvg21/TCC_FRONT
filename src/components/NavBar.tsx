import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

export const NavBar = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
     const { t } = useTranslation();

    
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
    return (

        <nav className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <LayoutDashboard className="h-8 w-8 text-blue-500" />
                        <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">{t('dashboard')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <LanguageSelector />
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>{t('logout')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

    )



}
