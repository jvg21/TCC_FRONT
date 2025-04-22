// src/components/pages/User.tsx (Refatorado)
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import { User } from '../../types/user';
import { useUserStore } from '../../store/userStore';
import { PageLayout } from '../common/PageLayout';
import { SectionHeader } from '../common/SectionHeader';
import { SearchBar } from '../common/SearchBar';
import { DataTable, Column } from '../common/DataTable';
import { ActionButtons } from '../common/ActionButtons';
import { UserForm } from '../forms/UserForm';
import { ConfirmationModal } from '../forms/ConfirmationModal';

export const UserManagement = () => {
  const { t } = useTranslation();
  const { users, loading, error, fetchUsers, addUser, updateUser, toggleUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.position && user.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddUser = async (userData: Omit<User, 'id'>) => {
    await addUser(userData);
  };

  const handleUpdateUser = async (userData: Omit<User, 'id'>) => {
    if (editingUser) {
      await updateUser(editingUser.id, userData);
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  // Definição das colunas da tabela
  const columns: Column<User>[] = [
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
      header: t('department'),
      accessor: (user) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {user.department || '-'}
        </div>
      )
    },
    {
      header: t('position'),
      accessor: (user) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {user.position || '-'}
        </div>
      )
    },
    {
      header: t('hireDate'),
      accessor: (user) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {user.hireDate ? new Date(user.hireDate).toLocaleDateString() : '-'}
        </div>
      )
    },
    {
      header: t('actions'),
      accessor: (user) => (
        <ActionButtons
          onEdit={() => setEditingUser(user)}
          onDelete={() => setUserToDelete(user)}
          showToggle={false}
          editTooltip={t('editEmployee')}
          deleteTooltip={t('deleteEmployee')}
        />
      ),
      className: 'text-right'
    }
  ];

  return (
    <PageLayout>
      <SectionHeader
        title={t('employeeManagement')}
        icon={<Users className="h-8 w-8 text-blue-500" />}
        showAddButton={true}
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
        columns={columns}
        data={filteredUsers}
        keyExtractor={(user) => user.id}
        isLoading={loading}
        error={error}
        emptyMessage={t('noEmployeesYet') || 'No employees added yet'}
        emptySearchMessage={t('noEmployeesFound') || 'No employees found matching your search'}
        searchTerm={searchTerm}
      />

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <UserForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddUser}
        />
      )}

      {/* Edit Employee Modal */}
      {editingUser && (
        <UserForm
          user={editingUser}
          isOpen={true}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdateUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleDeleteUser}
          title={t('deleteEmployee')}
          message={t('confirmDelete')}
          confirmLabel={t('delete')}
          cancelLabel={t('cancel')}
          variant="danger"
        />
      )}
    </PageLayout>
  );
};