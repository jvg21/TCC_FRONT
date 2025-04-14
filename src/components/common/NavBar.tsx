// src/components/NavBar.tsx (Corrigido)
import { useState } from 'react';
import { LayoutDashboard, LogOut, User, ChevronDown, Settings, Moon, Sun, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';

export const NavBar = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { toggleLanguage, currentLanguage } = useLanguage();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    const handleItemClick = (callback: () => void) => {
        callback();
        // Não fechar o dropdown automaticamente após clicar em um item
        // para evitar que o usuário perca o contexto
    };

    const handleCloseDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center cursor-pointer" onClick={()=>{navigate('/dashboard')}}>
                        <LayoutDashboard className="h-8 w-8 text-blue-500"  />
                        <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                            {t('dashboard')}
                        </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                            <span className="text-gray-700 dark:text-gray-200 mr-2">
                                {t('welcome')}, {user?.name}!
                            </span>
                        </div>
                        
                        <div className="relative">
                            <button 
                                onClick={toggleDropdown}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="true"
                            >
                                <User className="h-5 w-5" />
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            
                            {isDropdownOpen && (
                                <div 
                                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-20"
                                >
                                    <div className="py-1 md:hidden">
                                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                            {t('welcome')}, {user?.name}!
                                        </div>
                                        <hr className="border-gray-200 dark:border-gray-600" />
                                    </div>
                                    
                                    <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                                        {t('settings')}
                                    </div>
                                    
                                    <button
                                        onClick={() => handleItemClick(toggleTheme)}
                                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        {isDarkMode ? (
                                            <>
                                                <Sun className="h-4 w-4" />
                                                <span>{t('lightMode')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon className="h-4 w-4" />
                                                <span>{t('darkMode')}</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={() => handleItemClick(toggleLanguage)}
                                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <Globe className="h-4 w-4" />
                                        <span>{t('language')} ({currentLanguage.toUpperCase()})</span>
                                    </button>
                                    
                                    <button
                                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>{t('options')}</span>
                                    </button>
                                    
                                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>{t('logout')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};