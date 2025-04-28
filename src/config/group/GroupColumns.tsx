// src/config/group/columns.tsx
import { Column } from '../../components/common/DataTable';
import { Group } from '../../types/group';
import { ActionButtons } from '../../components/common/ActionButtons';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Users, Eye } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface GetColumnsProps {
  onEdit?: (group: Group) => void;
  onViewUsers: (group: Group) => void;
  onToggle?: (group: Group) => void;
  isEmployee: boolean;
}

export const getGroupColumns = ({
  onEdit,
  onViewUsers,
  onToggle,
  isEmployee
}: GetColumnsProps): Column<Group>[] => {
  const { t } = useLanguage();

  const baseColumns: Column<Group>[] = [
    {
      header: t('name'),
      accessor: (group) => (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {group.name}
        </div>
      )
    },
    {
      header: t('description'),
      accessor: (group) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {group.description}
        </div>
      )
    },
    {
      header: t('users'),
      accessor: (group) => (
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent event propagation
              onViewUsers(group);
            }}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title={t('viewUsers')}
          >
            <Users className="h-5 w-5 mr-1" />
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {group.users?.length || 0}
            </span>
            <Eye className="ml-1 h-4 w-4" />
          </button>
        </div>
      )
    },
    {
      header: t('status'),
      accessor: (group) => (
        <StatusBadge
          label={group.isActive ? t('active') : t('inactive')}
          variant={group.isActive ? 'success' : 'danger'}
        />
      )
    }
  ];

  // Only add actions column if not an employee
  if (!isEmployee) {
    baseColumns.push({
      header: t('actions'),
      accessor: (group) => (
        <ActionButtons
          onEdit={onEdit ? () => onEdit(group) : undefined}
          onToggle={onToggle ? () => onToggle(group) : undefined}
          isActive={group.isActive}
          showToggle={true}
          showDelete={false}
          editTooltip={t('editGroup')}
        />
      ),
      className: 'text-right'
    });
  }
  
  return baseColumns;
};