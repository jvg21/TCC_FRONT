import { useState, useEffect } from 'react';
import { CheckSquare, Filter, X } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { useTaskStore } from '../../store/taskStore';
import { useUserStore } from '../../store/userStore';
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

interface TaskFilters {
  dateFrom: string;
  dateTo: string;
  assigneeId: number;
  status: number;
  priority: number;
  isActive: boolean;
}

export const TaskManagement = () => {
  const { t } = useLanguage();
  const { tasks, loading, error, fetchTasks, toggleTaskStatus } = useTaskStore();
  const { users, fetchUsers } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [assigningTask, setAssigningTask] = useState<Task | null>(null);
  const [toggleTask, setToggleTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<TaskFilters>({
    dateFrom: '',
    dateTo: '',
    assigneeId: 0,
    status: 0,
    priority: 0,
    isActive: true // Filtrar apenas ativas por padrão
  });

  const isEmployee = currentUser?.profile === 3;

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      assigneeId: 0,
      status: 0,
      priority: 0,
      isActive: true
    });
  };

  const filteredTasks = tasks.filter(task => {
    // Filtro de texto
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de data
    const matchesDate = (!filters.dateFrom || new Date(task.createdAt) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(task.createdAt) <= new Date(filters.dateTo));

    // Filtro de responsável
    const matchesAssignee = filters.assigneeId === 0 || task.assigneeId === filters.assigneeId;

    // Filtro de status
    const matchesStatus = filters.status === 0 || task.status === filters.status;

    // Filtro de prioridade
    const matchesPriority = filters.priority === 0 || task.priority === filters.priority;

    // Filtro de ativo/inativo
    const matchesActive = task.isActive === filters.isActive;

    return matchesSearch && matchesDate && matchesAssignee && matchesStatus && matchesPriority && matchesActive;
  });

  const handleToggleActivation = async (task: Task) => {
    try {
      await toggleTaskStatus(task.taskId);
      setToggleTask(null);
    } catch (error) {
      console.error('Toggle activation failed:', error);
    }
  };

  const columns = getTaskColumns({
    onEdit: setEditingTask,
    onToggle: setToggleTask,
    onViewDetails: setViewingTask,
    onAssign: setAssigningTask,
    currentUserId: currentUser?.userId || 0,
    isEmployee
  });

  // Opções para os selects
  const statusOptions = [
    { value: 0, label: t('allStatuses') },
    { value: TaskStatus.TODO, label: t('todo') },
    { value: TaskStatus.IN_PROGRESS, label: t('inProgress') },
    { value: TaskStatus.REVIEW, label: t('inReview') },
    { value: TaskStatus.DONE, label: t('done') }
  ];

  const priorityOptions = [
    { value: 0, label: t('allPriorities') },
    { value: TaskPriority.LOW, label: t('low') },
    { value: TaskPriority.MEDIUM, label: t('medium') },
    { value: TaskPriority.HIGH, label: t('high') },
    { value: TaskPriority.URGENT, label: t('urgent') }
  ];

  const assigneeOptions = [
    { value: 0, label: t('allAssignees') },
    { value: -1, label: t('unassigned') },
    ...users
      .filter(u => u.isActive && u.companyId === currentUser?.companyId)
      .map(u => ({ value: u.userId, label: u.name }))
  ];

  return (
    <PageLayout>
      <SectionHeader
        title={t('taskManagement')}
        icon={<CheckSquare className="h-8 w-8 text-blue-500" />}
        showAddButton={true}
        addButtonLabel={t('addTask')}
        onAddClick={() => setShowAddModal(true)}
      />

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('searchTasks')}
          />
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            {t('filters')}
          </button>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Data De */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('dateFrom')}
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              {/* Data Até */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('dateTo')}
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              {/* Responsável */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('assignee')}
                </label>
                <select
                  value={filters.assigneeId}
                  onChange={(e) => handleFilterChange('assigneeId', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {assigneeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('status')}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prioridade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('priority')}
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ativo/Inativo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('status')}
                </label>
                <select
                  value={filters.isActive ? 'true' : 'false'}
                  onChange={(e) => handleFilterChange('isActive', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="true">{t('active')}</option>
                  <option value="false">{t('inactive')}</option>
                </select>
              </div>
            </div>

            {/* Botão limpar filtros */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-4 w-4 mr-1" />
                {t('clearFilters')}
              </button>
            </div>
          </div>
        )}
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

      {/* Modais */}
      {showAddModal && (
        <TaskForm
          onClose={() => setShowAddModal(false)}
          isOpen={showAddModal}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          isOpen={!!editingTask}
        />
      )}

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

      {assigningTask && (
        <TaskAssignment
          task={assigningTask}
          isOpen={!!assigningTask}
          onClose={() => setAssigningTask(null)}
        />
      )}

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