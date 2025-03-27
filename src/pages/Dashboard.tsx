import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { NavBar } from '../components/NavBar';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar/>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('welcome')}, {user?.name}!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Example dashboard cards */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Card {i}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sample dashboard content
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};