// src/config/task/Task.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckSquare } from 'lucide-react';
import { Task } from '../../types/task';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { PageLayout } from '../../components/common/PageLayout';
import { SectionHeader } from '../../components/common/SectionHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { ConfirmationModal } from '../../components/forms/ConfirmationModal';
import { TaskForm } from './TaskForm';
import { TaskViewer } from './TaskViewer';
import { TaskAssignment } from './TaskAssignment';
import { getTaskColumns } from './TaskColumns';

export const TaskManagement = () => {
  const { t } = useTranslation();
  const { tasks, loading, error, fetchTasks, toggleTaskStatus } = useTaskStore();
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  
  // Check if current user is an employee (Profile 3)
  const isEmployee = currentUser?.profile === 3;

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter(
    task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (task: Task) => {
    try {
      await toggleTaskStatus(task.taskId);
      setIsStatusModalOpen(false);
      setCurrentTask(null);
    } catch (error) {
      console.error('Toggle status failed:', error);
    }
  };

  const openAddModal = () => {
    setCurrentTask(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };

  const openViewModal = (task: Task) => {
    setCurrentTask(task);
    setIsViewModalOpen(true);
  };

  const openAssignModal = (task: Task) => {
    setCurrentTask(task);
    setIsAssignModalOpen(true);
  };

  const openStatusModal = (task: Task) => {
    setCurrentTask(task);
    setIsStatusModalOpen(true);
  };

  // Get columns configuration
  const columns = getTaskColumns({
    onEdit: openEditModal,
    onToggle: openStatusModal,
    onViewDetails: openViewModal,
    onAssign: openAssignModal,
    currentUserId: currentUser?.userId || 0,
    isEmployee
  });

  return (
    <PageLayout>
      <SectionHeader
        title={t('taskManagement')}
        icon={<CheckSquare className="h-8 w-8 text-blue-500" />}
        showAddButton={true}
        addButtonLabel={t('addTask')}
        onAddClick={openAddModal}
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t('searchTasks')}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredTasks}
        keyExtractor={(task) => task.taskId.toString()}
        isLoading={loading}
        error={error}
        emptyMessage={t('noTasksYet')}
        emptySearchMessage={t('noTasksFound')}
        searchTerm={searchTerm}
      />

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <TaskForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && currentTask && (
        <TaskForm
          task={currentTask}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* View Task Modal */}
      {isViewModalOpen && currentTask && (
        <TaskViewer
          task={currentTask}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onEdit={() => {
            setIsViewModalOpen(false);
            openEditModal(currentTask);
          }}
        />
      )}

      {/* Assign Task Modal */}
      {isAssignModalOpen && currentTask && (
        <TaskAssignment
          task={currentTask}
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
        />
      )}

      {/* Toggle Status Confirmation Modal */}
      {isStatusModalOpen && currentTask && (
        <ConfirmationModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onConfirm={() => handleToggleStatus(currentTask)}
          title={currentTask.isActive ? t('deactivateTask') : t('activateTask')}
          message={currentTask.isActive 
            ? t('deactivateTaskConfirmation', { title: currentTask.title }) 
            : t('activateTaskConfirmation', { title: currentTask.title })}
          confirmLabel={currentTask.isActive ? t('deactivate') : t('activate')}
          cancelLabel={t('cancel')}
          variant={currentTask.isActive ? 'danger' : 'success'}
        />
      )}
    </PageLayout>
  );
};