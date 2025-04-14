// src/components/pages/Group.tsx (Refactored)
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import { useGroupStore } from '../../store/groupStore';
import { Group } from '../../types/group';
import { PageLayout } from '../common/PageLayout';
import { SectionHeader } from '../common/SectionHeader';
import { SearchBar } from '../common/SearchBar';
import { DataTable, Column } from '../common/DataTable';
import { ActionButtons } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';
import { GroupForm } from '../forms/GroupForms';
import { ConfirmationModal } from '../forms/ConfirmationModal';

export const GroupManagement = () => {
  const { t } = useTranslation();
  const { groups, loading, error, fetchGroups, toggleGroupStatus } = useGroupStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

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

  const openDeleteModal = (group: Group) => {
    setCurrentGroup(group);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (currentGroup) {
      try {
        // In a real implementation, call deleteGroup from the store
        console.log(`Delete group with ID: ${currentGroup.groupId}`);
        // await deleteGroup(currentGroup.groupId);
        setIsDeleteModalOpen(false);
        setCurrentGroup(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  // Table columns definition
  const columns: Column<Group>[] = [
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
          <Users className="h-5 w-5 text-blue-500 mr-1" />
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {group.users?.length || 0}
          </span>
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
    },
    {
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
      )
    }
  ];

  return (
    <PageLayout>
      <SectionHeader
        title={t('groups')}
        icon={<Users className="h-8 w-8 text-blue-500" />}
        showAddButton={true}
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
        keyExtractor={(group) => group.groupId}
        isLoading={loading}
        error={error}
        emptyMessage={t('noGroupsYet')}
        emptySearchMessage={t('noGroupsFound')}
        searchTerm={searchTerm}
      />

      {/* Add Group Modal */}
      {isAddModalOpen && (
        <GroupForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Edit Group Modal */}
      {isEditModalOpen && currentGroup && (
        <GroupForm
          group={currentGroup}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentGroup && (
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
    </PageLayout>
  );
};