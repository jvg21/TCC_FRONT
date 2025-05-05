// src/config/user/columns.tsx
import { Column } from '../../components/common/DataTable';
import { User } from '../../types/user';
import { ActionButtons } from '../../components/common/ActionButtons';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../hooks/useLanguage';

interface GetColumnsProps {
  onEdit: (user: User) => void;
  onToggle: (user: User) => void;
  currentUser: User | null;
  isEmployee: boolean;
}

export const getUserColumns = ({
  onEdit,
  onToggle,
  currentUser,
  isEmployee
}: GetColumnsProps): Column<User>[] => {
  const { t } = useLanguage();

  const getProfileName = (profileId: number): string => {
    switch (profileId) {
      case 1:
        return t('administrator');
      case 2:
        return t('manager');
      case 3:
        return t('employee');
      default:
        return t('unknown');
    }
  };

  const baseColumns: Column<User>[] = [
    {
      header: t('name'),
      accessor: (user) => (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {user.name}
        </div>
      )
    },
    {
      header: t('email'),
      accessor: (user) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {user.email}
        </div>
      )
    },
    {
      header: t('profile'),
      accessor: (user) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {getProfileName(user.profile)}
        </div>
      )
    },
    {
      header: t('status'),
      accessor: (user) => (
        <StatusBadge
          label={user.isActive ? t('active') : t('inactive')}
          variant={user.isActive ? 'success' : 'danger'}
        />
      )
    },
    {
      header: t('lastLoginAt'),
      accessor: (user) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '-'}
        </div>
      )
    }
  ];

  if (!isEmployee) {
    baseColumns.push({
      header: t('actions'),
      accessor: (user) => {
        // erro NORMAL, SEGUE O JOGO
        const canEdit = currentUser?.profile <= user.profile;
        
        return (
          <ActionButtons
            onEdit={canEdit ? () => onEdit(user) : undefined}
            onToggle={canEdit ? () => onToggle(user) : undefined}
            isActive={user.isActive}
            showToggle={canEdit}
            showDelete={false}
            editTooltip={t('editEmployee')}
          />
        );
      },
      className: 'text-right'
    });
  }
  
  return baseColumns;
};