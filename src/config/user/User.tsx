import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import { User } from '../../types/user';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { DataTable } from '../../components/common/DataTable';
import { PageLayout } from '../../components/common/PageLayout';
import { SectionHeader } from '../../components/common/SectionHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { UserForm } from './UserForm';
import { ConfirmationModal } from '../../components/forms/ConfirmationModal';
import { getUserColumns } from './UserColumns';

export const UserManagement = () => {
  const { t } = useTranslation();
  const { users, loading, error, fetchUsers, addUser, updateUser, toggleUser } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);

  // Check if current user is an employee (Profile 3)
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

  // Get columns configuration from UserColumns.tsx
  const columns = getUserColumns({
    onEdit: setEditingUser,
    onToggle: setUserToToggle,
    currentUser,
    isEmployee
  });

  return (
    <PageLayout>
      <SectionHeader
        title={t('employeeManagement')}
        icon={<Users className="h-8 w-8 text-blue-500" />}
        showAddButton={!isEmployee}
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
        keyExtractor={(user) => user.userId.toString()}
        isLoading={loading}
        error={error}
        emptyMessage={t('noEmployeesYet') || 'No employees added yet'}
        emptySearchMessage={t('noEmployeesFound') || 'No employees found matching your search'}
        searchTerm={searchTerm}
      />

      {/* Add Employee Modal - only rendered if not an employee */}
      {!isEmployee && isAddModalOpen && (
        <UserForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddUser}
        />
      )}

      {/* Edit Employee Modal - only rendered if not an employee */}
      {!isEmployee && editingUser && (
        <UserForm
          user={editingUser}
          isOpen={true}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdateUser}
        />
      )}

      {/* Toggle Status Confirmation Modal - only rendered if not an employee */}
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