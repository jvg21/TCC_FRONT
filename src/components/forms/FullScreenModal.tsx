// src/components/forms/FullScreenModal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const FullScreenModal: React.FC<FullScreenModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {title && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        <div className={`${title ? '' : 'ml-auto'}`}>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Fechar"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};