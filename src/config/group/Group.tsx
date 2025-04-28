// src/components/pages/Group.tsx (Updated)
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from 'lucide-react';
import { useGroupStore } from '../../store/groupStore';
import { Group } from '../../types/group';
import { useAuthStore } from '../../store/authStore';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PageLayout } from '../../components/common/PageLayout';
import { getGroupColumns } from './GroupColumns';
import { Modal } from '../../components/forms/Modal';
import { DataTable } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { GroupForm } from './GroupForms';
import { ConfirmationModal } from '../../components/forms/ConfirmationModal';

export const GroupManagement = () => {
  const { t } = useTranslation();
  const { groups, loading, error, fetchGroups, toggleGroupStatus } = useGroupStore();
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewUsersModalOpen, setIsViewUsersModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Check if current user is an employee (Profile 3)
  const isEmployee = currentUser?.profile === 3;

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const filteredGroups = groups.filter(
    group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (group: Group) => {
    try {
      await toggleGroupStatus(group.groupId);
    } catch (error) {
      console.error('Toggle status failed:', error);
    }
  };

  const openAddModal = () => {
    setCurrentGroup(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (group: Group) => {
    setCurrentGroup(group);
    setIsEditModalOpen(true);
  };

  const openViewUsersModal = (group: Group) => {
    setCurrentGroup(group);
    setModalLoading(true);
    setIsViewUsersModalOpen(true);
    
    // Reset loading after a short delay to give modal time to render
    setTimeout(() => {
      setModalLoading(false);
    }, 500);
  };

  const handleDelete = async () => {
    if (currentGroup) {
      try {
        await toggleGroupStatus(currentGroup.groupId);
        setIsDeleteModalOpen(false);
        setCurrentGroup(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  // Component to show group users in a modal
  const UsersViewModal = ({ group, isOpen, onClose }: { group: Group, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen || !group) return null;
    
    // Safety check to ensure group.users exists
    const users = group.users || [];
    const userCount = users.length;
    
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`${t('usersInGroup')}: ${group.name}`}
        maxWidth="md"
      >
        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          {t('totalUsers')}: {userCount}
        </div>
        
        {modalLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : userCount > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('email')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('profile')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map(user => (
                  <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        label={t(user.profile === 1 ? 'administrator' : user.profile === 2 ? 'manager' : 'employee')}
                        variant={user.profile === 1 ? 'info' : user.profile === 2 ? 'warning' : 'default'}
                        size="sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400 italic">
            {t('noUsersInGroup')}
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t('close')}
          </button>
        </div>
      </Modal>
    );
  };

  // Get columns configuration
  const columns = getGroupColumns({
    onEdit: isEmployee ? undefined : openEditModal,
    onViewUsers: openViewUsersModal,
    onToggle: isEmployee ? undefined : handleToggleStatus,
    isEmployee
  });

  return (
    <PageLayout>
      <SectionHeader
        title={t('groups')}
        icon={<Grid className="h-8 w-8 text-blue-500" />}
        showAddButton={!isEmployee} // Hide add button for employees
        addButtonLabel={t('addGroup')}
        onAddClick={openAddModal}
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t('searchGroups')}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredGroups}
        keyExtractor={(group) => group.groupId.toString()}
        isLoading={loading}
        error={error}
        emptyMessage={t('noGroupsYet')}
        emptySearchMessage={t('noGroupsFound')}
        searchTerm={searchTerm}
      />

      {/* Add Group Modal */}
      {!isEmployee && isAddModalOpen && (
        <GroupForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Edit Group Modal */}
      {!isEmployee && isEditModalOpen && currentGroup && (
        <GroupForm
          group={currentGroup}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {!isEmployee && isDeleteModalOpen && currentGroup && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title={t('deleteGroup')}
          message={t('deleteGroupConfirmation')}
          confirmLabel={t('delete')}
          cancelLabel={t('cancel')}
          variant="danger"
        />
      )}

      {/* View Users Modal */}
      {isViewUsersModalOpen && currentGroup && (
        <UsersViewModal
          group={currentGroup}
          isOpen={isViewUsersModalOpen}
          onClose={() => setIsViewUsersModalOpen(false)}
        />
      )}
    </PageLayout>
  );
};