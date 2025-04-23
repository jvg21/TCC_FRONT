import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Grid, Eye } from 'lucide-react';
import { useGroupStore } from '../../store/groupStore';
import { Group } from '../../types/group';
import { useAuthStore } from '../../store/authStore';
import { PageLayout } from '../common/PageLayout';
import { SectionHeader } from '../common/SectionHeader';
import { SearchBar } from '../common/SearchBar';
import { DataTable, Column } from '../common/DataTable';
import { ActionButtons } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmationModal } from '../forms/ConfirmationModal';
import { Modal } from '../forms/Modal';
import { GroupForm } from '../forms/GroupForms';

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
  
  // Verificação se o usuário atual é funcionário (Profile 3)
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
    setIsViewUsersModalOpen(true);
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

  // Componente para mostrar usuários do grupo em um modal
  const UsersViewModal = ({ group, isOpen, onClose }: { group: Group, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen || !group) return null;
    
    const userCount = group.users?.length || 0;
    
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
        
        {userCount > 0 ? (
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
                {group.users?.map(user => (
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

  // Definição das colunas da tabela - Remove a coluna de ações para funcionários
  const getColumns = (): Column<Group>[] => {
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
              onClick={() => openViewUsersModal(group)}
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

    // Apenas adiciona a coluna de ações se não for um funcionário
    if (!isEmployee) {
      baseColumns.push({
        header: t('actions'),
        accessor: (group) => (
          <ActionButtons
            onEdit={() => openEditModal(group)}
            onToggle={() => handleToggleStatus(group)}
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

  return (
    <PageLayout>
      <SectionHeader
        title={t('groups')}
        icon={<Grid className="h-8 w-8 text-blue-500" />}
        showAddButton={!isEmployee} // Oculta botão de adicionar para funcionários
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
        columns={getColumns()}
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