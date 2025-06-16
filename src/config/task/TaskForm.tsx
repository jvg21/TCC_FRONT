// src/config/task/TaskForm.tsx - Versão Corrigida
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { useTaskStore } from '../../store/taskStore';
import { useUserStore } from '../../store/userStore';
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
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: '',
    assigneeId: 0,
    parentTaskId: 0,
    userId: currentUser?.userId || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Buscar usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Carregar dados da tarefa ao editar
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TaskStatus.TODO,
        priority: task.priority || TaskPriority.MEDIUM,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assigneeId: task.assigneeId || 0,
        parentTaskId: task.parentTaskId || 0,
        userId: task.userId || currentUser?.userId || 0
      });
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: '',
        assigneeId: 0,
        parentTaskId: 0,
        userId: currentUser?.userId || 0
      });
    }
    setErrors({});
  }, [task, currentUser, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' || name === 'priority' || name === 'assigneeId' || name === 'parentTaskId' || name === 'userId'
        ? parseInt(value) || 0
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
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
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const taskData: any = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : '',
        ...(formData.assigneeId !== 0 && { assigneeId: formData.assigneeId }),
        ...(formData.parentTaskId !== 0 && { parentTaskId: formData.parentTaskId }),
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
    { value: '0', label: t('unassigned') }
  ].concat(
    users
      .filter(u => u.isActive && u.companyId === currentUser?.companyId)
      .map(u => ({
        value: u.userId.toString(),
        label: u.name
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
              value={formData.status.toString()}
              onChange={handleChange}
              options={statusOptions}
              error={errors.status}
              required
            />
            
            <FormSelect
              id="priority"
              name="priority"
              label={t('priority')}
              value={formData.priority.toString()}
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
              type="date"
              label={t('dueDate')}
              value={formData.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
            />
            
            <FormSelect
              id="assigneeId"
              name="assigneeId"
              label={t('assignee')}
              value={formData.assigneeId.toString()}
              onChange={handleChange}
              options={assigneeOptions}
              error={errors.assigneeId}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? t('saving') : isEditing ? t('update') : t('create')}
          </button>
        </div>
      </form>
    </Modal>
  );
};