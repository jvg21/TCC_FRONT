// src/config/task/TaskForm.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { useTaskStore } from '../../store/taskStore';
import { useUserStore } from '../../store/userStore';
import { useGroupStore } from '../../store/groupStore';
import { useAuthStore } from '../../store/authStore';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormField';
import { Modal } from '../../components/forms/Modal';

interface TaskFormProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskForm = ({ task, isOpen, onClose }: TaskFormProps) => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuthStore();
  const { addTask, updateTask } = useTaskStore();
  const { users, fetchUsers } = useUserStore();
  const { groups, fetchGroups } = useGroupStore();
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.TODO.toString(),
    priority: TaskPriority.MEDIUM.toString(),
    dueDate: '',
    assigneeId: '',
    groupId: '',
    userId: currentUser?.userId || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Buscar usuários e grupos ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchUsers(), fetchGroups()]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchUsers, fetchGroups]);

  // Carregar dados da tarefa ao editar
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status.toString(),
        priority: task.priority.toString(),
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assigneeId: task.assigneeId ? task.assigneeId.toString() : '',
        groupId: task.groupId ? task.groupId.toString() : '',
        userId: task.userId
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Atualiza os dados do formulário
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpa erros quando o campo é editado
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = t('titleRequired');
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t('descriptionRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Preparar os dados da tarefa
      const taskData = {
        ...formData,
        status: parseInt(formData.status) as TaskStatus,
        priority: parseInt(formData.priority) as TaskPriority,
        assigneeId: formData.assigneeId ? parseInt(formData.assigneeId) : undefined,
        groupId: formData.groupId ? parseInt(formData.groupId) : undefined,
        userId: formData.userId
      };
      
      if (isEditing && task) {
        await updateTask(task.taskId, taskData);
      } else {
        await addTask(taskData);
      }
      
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Preparar opções para os selects
  const statusOptions = [
    { value: TaskStatus.TODO.toString(), label: t('todo') },
    { value: TaskStatus.IN_PROGRESS.toString(), label: t('inProgress') },
    { value: TaskStatus.REVIEW.toString(), label: t('inReview') },
    { value: TaskStatus.DONE.toString(), label: t('done') }
  ];
  
  const priorityOptions = [
    { value: TaskPriority.LOW.toString(), label: t('low') },
    { value: TaskPriority.MEDIUM.toString(), label: t('medium') },
    { value: TaskPriority.HIGH.toString(), label: t('high') },
    { value: TaskPriority.URGENT.toString(), label: t('urgent') }
  ];
  
  // Filtrar usuários ativos da mesma empresa
  const assigneeOptions = [
    { value: '', label: t('unassigned') }
  ].concat(
    users
      .filter(u => u.isActive && u.companyId === currentUser?.companyId)
      .map(u => ({
        value: u.userId.toString(),
        label: u.name
      }))
  );
  
  // Filtrar grupos ativos da mesma empresa
  const groupOptions = [
    { value: '', label: t('noGroup') }
  ].concat(
    groups
      .filter(g => g.isActive && g.companyId === currentUser?.companyId)
      .map(g => ({
        value: g.groupId.toString(),
        label: g.name
      }))
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('editTask') : t('addTask')}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormInput
            id="title"
            name="title"
            label={t('title')}
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
          
          <FormTextarea
            id="description"
            name="description"
            label={t('description')}
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            required
            rows={4}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              id="status"
              name="status"
              label={t('status')}
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              error={errors.status}
              required
            />
            
            <FormSelect
              id="priority"
              name="priority"
              label={t('priority')}
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
              error={errors.priority}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="dueDate"
              name="dueDate"
              label={t('dueDate')}
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
            />
            
            <FormSelect
              id="assigneeId"
              name="assigneeId"
              label={t('assignee')}
              value={formData.assigneeId}
              onChange={handleChange}
              options={assigneeOptions}
              error={errors.assigneeId}
            />
          </div>
          
          <FormSelect
            id="groupId"
            name="groupId"
            label={t('group')}
            value={formData.groupId}
            onChange={handleChange}
            options={groupOptions}
            error={errors.groupId}
          />
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={loading}
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isEditing ? t('update') : t('create')}
          </button>
        </div>
      </form>
    </Modal>
  );
};