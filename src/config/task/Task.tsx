import { useState, useEffect } from 'react';
import { CheckSquare } from 'lucide-react';
import { Task } from '../../types/task';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { useLanguage } from '../../hooks/useLanguage';
import { getTaskColumns } from './TaskColumns';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PageLayout } from '../../components/common/PageLayout';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { TaskForm } from './TaskForm';
import { TaskViewer } from './TaskViewer';
import { TaskAssignment } from './TaskAssignment';
import { ConfirmationModal } from '../../components/forms/ConfirmationModal';

export const TaskManagement = () => {
  const { t } = useLanguage();
  const { tasks, loading, error, fetchTasks, toggleTaskStatus } = useTaskStore();
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [assigningTask, setAssigningTask] = useState<Task | null>(null);
  const [toggleTask, setToggleTask] = useState<Task | null>(null);

  // Check if current user is an employee (Profile 3)
  const isEmployee = currentUser?.profile === 3;

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActivation = async (task: Task) => {
    try {
      await toggleTaskStatus(task.taskId);
      setToggleTask(null);
    } catch (error) {
      console.error('Toggle activation failed:', error);
    }
  };

  // Get columns configuration seguindo o modelo de empresa
  const columns = getTaskColumns({
    onEdit: setEditingTask,
    onToggle: setToggleTask,
    onViewDetails: setViewingTask,
    onAssign: setAssigningTask,
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
        onAddClick={() => setShowAddModal(true)}
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
      {showAddModal && (
        <TaskForm
          onClose={() => setShowAddModal(false)}
          isOpen={showAddModal}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          isOpen={!!editingTask}
        />
      )}

      {/* View Task Modal */}
      {viewingTask && (
        <TaskViewer
          task={viewingTask}
          isOpen={!!viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={() => {
            setViewingTask(null);
            setEditingTask(viewingTask);
          }}
        />
      )}

      {/* Assign Task Modal */}
      {assigningTask && (
        <TaskAssignment
          task={assigningTask}
          isOpen={!!assigningTask}
          onClose={() => setAssigningTask(null)}
        />
      )}

      {/* Toggle Activation Modal */}
      {toggleTask && (
        <ConfirmationModal
          isOpen={!!toggleTask}
          onClose={() => setToggleTask(null)}
          onConfirm={() => handleToggleActivation(toggleTask)}
          title={toggleTask.isActive ? t('confirmDeactivation') : t('confirmActivation')}
          message={toggleTask.isActive 
            ? t('deactivateTaskConfirmation', { title: toggleTask.title }) 
            : t('activateTaskConfirmation', { title: toggleTask.title })}
          confirmLabel={toggleTask.isActive ? t('deactivate') : t('activate')}
          cancelLabel={t('cancel')}
          variant={toggleTask.isActive ? 'danger' : 'success'}
        />
      )}
    </PageLayout>
  );
};