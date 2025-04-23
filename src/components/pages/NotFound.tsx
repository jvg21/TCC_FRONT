import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mt-4 mb-6">
          {t('pageNotFound')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {t('pageNotFoundMessage')}
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
          <Link 
            to="/dashboard"
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <Home className="h-5 w-5 mr-2" />
            {t('goHome')}
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('goBack')}
          </button>
        </div>
      </div>
    </div>
  );
};