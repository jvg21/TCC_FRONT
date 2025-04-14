// src/components/common/ActionButtons.tsx
import React from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { ToggleSwitch } from '../utils/ToggleSwitch';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: () => void;
  isActive?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showToggle?: boolean;
  editTooltip?: string;
  deleteTooltip?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  onToggle,
  isActive,
  showEdit = true,
  showDelete = true,
  showToggle = false,
  editTooltip = 'Edit',
  deleteTooltip = 'Delete'
}) => {
  return (
    <div className="flex items-center justify-end space-x-3">
      {showEdit && onEdit && (
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
          title={editTooltip}
        >
          <Edit className="h-5 w-5" />
        </button>
      )}
      
      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
          title={deleteTooltip}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      )}
      
      {showToggle && onToggle && (
        <ToggleSwitch 
          isActive={isActive ?? false}
          onChange={onToggle}
        />
      )}
    </div>
  );
};

// Alternative dropdown menu for actions when space is limited
export const ActionsDropdown: React.FC<{
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: () => void;
  isActive?: boolean;
  editLabel?: string;
  deleteLabel?: string;
  toggleActiveLabel?: string;
  toggleInactiveLabel?: string;
}> = ({
  onEdit,
  onDelete,
  onToggle,
  isActive,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  toggleActiveLabel = 'Activate',
  toggleInactiveLabel = 'Deactivate'
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
          <div className="py-1">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit();
                  setIsOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                {editLabel}
              </button>
            )}
            
            {onToggle && (
              <button
                onClick={() => {
                  onToggle();
                  setIsOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                {isActive ? toggleInactiveLabel : toggleActiveLabel}
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => {
                  onDelete();
                  setIsOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600"
              >
                {deleteLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};