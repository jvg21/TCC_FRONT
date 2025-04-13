import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Search, X, Users } from 'lucide-react';
import { NavBar } from '../NavBar';
import { Group } from '../../types/group';
import { useGroupStore } from '../../store/groupStore';
import { ToggleSwitch } from '../ToggleSwitch';
import { GroupForm } from '../forms/GroupForms';

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('groups')}
                </h2>
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-1" />
                {t('addGroup')}
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchGroups')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg text-red-700 dark:text-red-200">
                {error}
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchTerm ? t('noGroupsFound') : t('noGroupsYet')}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('name')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('description')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('users')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredGroups.map((group) => (
                      <tr key={group.groupId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {group.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {group.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-blue-500 mr-1" />
                            <span className="text-sm text-gray-500 dark:text-gray-300">
                              {group.users?.length || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            group.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {group.isActive ? t('active') : t('inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => openEditModal(group)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                              title={t('editGroup')}
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            {/* <button
                              onClick={() => openDeleteModal(group)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                              title={t('deleteGroup')}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button> */}
                            <ToggleSwitch 
                              isActive={group.isActive}
                              onChange={() => handleToggleStatus(group)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('deleteGroup')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t('deleteGroupConfirmation')}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};