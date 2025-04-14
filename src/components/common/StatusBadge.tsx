// src/components/common/StatusBadge.tsx
import React from 'react';

export type StatusVariant = 'success' | 'danger' | 'warning' | 'info' | 'default';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  label, 
  variant = 'default',
  size = 'sm'
}) => {
  // Define variant styles
  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'danger':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Define size classes
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'md':
        return 'px-2.5 py-1 text-sm';
      case 'lg':
        return 'px-3 py-1.5 text-base';
      default:
        return 'px-2 py-0.5 text-xs';
    }
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${getVariantClass()} ${getSizeClass()}`}>
      {label}
    </span>
  );
};