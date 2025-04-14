// src/components/pages/Dashboard.tsx (Refactored)
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '../common/PageLayout';
import { ContentCard } from '../common/PageLayout';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  return (
    <PageLayout>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {t('welcome')}, {user?.name}!
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Example dashboard cards */}
        {[1, 2, 3].map((i) => (
          <ContentCard
            key={i}
            title={`Card ${i}`}
          >
            <p className="text-gray-600 dark:text-gray-300">
              Sample dashboard content
            </p>
          </ContentCard>
        ))}
      </div>
    </PageLayout>
  );
};