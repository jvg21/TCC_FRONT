// src/components/common/SectionHeader.tsx
import React, { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactElement;
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAddClick?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  showAddButton = false,
  addButtonLabel = 'Add',
  onAddClick
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        {icon && <div className="mr-2">{icon}</div>}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      
      {showAddButton && (
        <button
          onClick={onAddClick}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-1" />
          {addButtonLabel}
        </button>
      )}
    </div>
  );
};