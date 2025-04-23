import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import { User } from '../../types/user';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { PageLayout } from '../common/PageLayout';
import { SectionHeader } from '../common/SectionHeader';
import { SearchBar } from '../common/SearchBar';
import { DataTable, Column } from '../common/DataTable';
import { ActionButtons } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';
import { UserForm } from '../forms/UserForm';
import { ConfirmationModal } from '../forms/ConfirmationModal';

export const UserManagement = () => {
  const { t } = useTranslation();
  const { users, loading, error, fetchUsers, addUser, updateUser, toggleUser } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);

  // Verificação se o usuário atual é funcionário (Profile 3)
  const isEmployee = currentUser?.profile === 3;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.profile.toString().includes(searchTerm))
  );

  const handleAddUser = async (userData: Omit<User, 'userId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addUser(userData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const handleUpdateUser = async (userData: Omit<User, 'userId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    if (editingUser) {
      try {
        await updateUser(editingUser.userId, userData);
        setEditingUser(null);
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    }
  };

  const handleToggleUser = async (user: User) => {
    try {
      await toggleUser(user.userId);
      setUserToToggle(null);
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

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

  // Definição das colunas da tabela - Remove a coluna de ações para funcionários
  const getColumns = (): Column<User>[] => {
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
          const canEdit = currentUser!.profile <= user.profile;
          
          return (
            <ActionButtons
              onEdit={canEdit ? () => setEditingUser(user) : undefined}
              onToggle={canEdit ? () => setUserToToggle(user) : undefined}
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

  return (
    <PageLayout>
      <SectionHeader
        title={t('employeeManagement')}
        icon={<Users className="h-8 w-8 text-blue-500" />}
        showAddButton={!isEmployee} // Oculta botão de adicionar para funcionários
        addButtonLabel={t('addEmployee')}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t('searchEmployees')}
        />
      </div>

      <DataTable
        columns={getColumns()}
        data={filteredUsers}
        keyExtractor={(user) => user.userId.toString()}
        isLoading={loading}
        error={error}
        emptyMessage={t('noEmployeesYet') || 'No employees added yet'}
        emptySearchMessage={t('noEmployeesFound') || 'No employees found matching your search'}
        searchTerm={searchTerm}
      />

      {/* Add Employee Modal - somente renderizado se não for funcionário */}
      {!isEmployee && isAddModalOpen && (
        <UserForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddUser}
        />
      )}

      {/* Edit Employee Modal - somente renderizado se não for funcionário */}
      {!isEmployee && editingUser && (
        <UserForm
          user={editingUser}
          isOpen={true}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdateUser}
        />
      )}

      {/* Toggle Status Confirmation Modal - somente renderizado se não for funcionário */}
      {!isEmployee && userToToggle && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setUserToToggle(null)}
          onConfirm={() => handleToggleUser(userToToggle)}
          title={userToToggle.isActive ? t('deactivateEmployee') : t('activateEmployee')}
          message={userToToggle.isActive 
            ? t('deactivateEmployeeConfirmation', { name: userToToggle.name }) 
            : t('activateEmployeeConfirmation', { name: userToToggle.name })}
          confirmLabel={userToToggle.isActive ? t('deactivate') : t('activate')}
          cancelLabel={t('cancel')}
          variant={userToToggle.isActive ? 'danger' : 'success'}
        />
      )}
    </PageLayout>
  );
};