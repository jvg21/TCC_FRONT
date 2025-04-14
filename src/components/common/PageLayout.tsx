// src/components/common/PageLayout.tsx
import React, { ReactNode } from 'react';
import { NavBar } from './NavBar';

interface PageLayoutProps {
  children: ReactNode;
  containerClassName?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children,
  containerClassName = ''
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 ${containerClassName}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// Content card component for dashboard sections
export const ContentCard: React.FC<{
  title?: string;
  children: ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};