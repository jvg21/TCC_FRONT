// Atualizando o componente NavBar.tsx para incluir links para o editor e kanban board

// src/components/common/NavBar.tsx
import { useState } from 'react';
import { LayoutDashboard, LogOut, User, ChevronDown, Settings, Moon, Sun, Globe, Users, Building, Grid, Menu, X, FileText, CheckSquare, Edit, Kanban } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prevState => !prevState);
    };

    const handleItemClick = (callback: () => void) => {
        callback();
    };

    const handleCloseDropdown = () => {
        setIsDropdownOpen(false);
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavigate('/dashboard')}>
                            <LayoutDashboard className="h-8 w-8 text-blue-500" />
                        </div>
                        
                        {/* Desktop Navigation Links */}
                        <div className="hidden md:block ml-10">
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/dashboard" 
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                                >
                                    {t('dashboard')}
                                </Link>
                                
                                {/* Only show Companies link for admins */}
                                {user?.profile === 1 && (
                                    <Link 
                                        to="/companies" 
                                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                                    >
                                        {t('companies')}
                                    </Link>
                                )}
                                
                                <Link 
                                    to="/companies/groups" 
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                                >
                                    {t('groups')}
                                </Link>
                                
                                <Link 
                                    to="/companies/user" 
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                                >
                                    {t('users')}
                                </Link>
                                
                                {/* Document Links */}
                                <div className="relative group">
                                    <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 flex items-center">
                                        {t('documents')}
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </button>
                                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <Link 
                                            to="/documents" 
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            {t('documentManagement')}
                                        </Link>
                                        <Link 
                                            to="/documents/workspace" 
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            {t('documentWorkspace')}
                                        </Link>
                                        <Link 
                                            to="/documents/editor" 
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            {t('documentEditor')}
                                        </Link>
                                    </div>
                                </div>
                                
                                {/* Task Links */}
                                <div className="relative group">
                                    <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 flex items-center">
                                        {t('tasks')}
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </button>
                                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <Link 
                                            to="/tasks" 
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            {t('taskManagement')}
                                        </Link>
                                        <Link 
                                            to="/tasks/board" 
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            {t('taskBoard')}
                                        </Link>
                                        <Link 
                                            to="/tasks/dashboard" 
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            {t('taskDashboard')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                            <span className="text-gray-700 dark:text-gray-200 mr-2">
                                {t('welcome')}, {user?.name}!
                            </span>
                        </div>
                        
                        <button 
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                        
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
            
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <button 
                            onClick={() => handleNavigate('/dashboard')}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            <LayoutDashboard className="h-5 w-5 inline-block mr-2" />
                            {t('dashboard')}
                        </button>
                        
                        {/* Only show Companies link for admins */}
                        {user?.profile === 1 && (
                            <button 
                                onClick={() => handleNavigate('/companies')}
                                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                            >
                                <Building className="h-5 w-5 inline-block mr-2" />
                                {t('companies')}
                            </button>
                        )}
                        
                        <button 
                            onClick={() => handleNavigate('/companies/groups')}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            <Grid className="h-5 w-5 inline-block mr-2" />
                            {t('groups')}
                        </button>
                        
                        <button 
                            onClick={() => handleNavigate('/companies/user')}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            <Users className="h-5 w-5 inline-block mr-2" />
                            {t('users')}
                        </button>
                        
                        {/* Document Links Mobile */}
                        <button 
                            onClick={() => handleNavigate('/documents')}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            <FileText className="h-5 w-5 inline-block mr-2" />
                            {t('documents')}
                        </button>
                        
                        <button 
                            onClick={() => handleNavigate('/documents/workspace')}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            <FileText className="h-5 w-5 inline-block mr-2" />
                            {t('documentWorkspace')}
                        </button>
                        
                        <button 
                            onClick={() => handleNavigate('/documents/editor')}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            <Edit className="h-5 w-5 inline-block mr-2" />
                            {t('documentEditor')}
                        </button>
                        
                        {/* Task Links Mobile */}
                        <button 
                            onClick={() => handleNavigate('/tasks')}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            <CheckSquare className="h-5 w-5 inline-block mr-2" />
                            {t('tasks')}
                        </button>
                        
                        <button 
                            onClick={() => handleNavigate('/tasks/board')}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            <Grid className="h-5 w-5 inline-block mr-2" />
                            {t('taskBoard')}
                        </button>
                        
                        <button 
                            onClick={() => handleNavigate('/tasks/dashboard')}
                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            <LayoutDashboard className="h-5 w-5 inline-block mr-2" />
                            {t('taskDashboard')}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};