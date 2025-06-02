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
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assigneeId: task.assigneeId || 0,
        parentTaskId: task.parentTaskId || 0,
        userId: task.userId
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Converte valores numéricos quando necessário
    let processedValue: any = value;
    if (name === 'status' || name === 'priority' || name === 'assigneeId' || name === 'parentTaskId') {
      processedValue = parseInt(value) || 0;
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
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
      
      // Preparar os dados da tarefa - CORRIGIDO
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
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
    { value: TaskStatus.DONE.toString(), label: t('done') },
    { value: TaskStatus.ARCHIVED.toString(), label: t('archived') }
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
              value={formData.assigneeId.toString()}
              onChange={handleChange}
              options={assigneeOptions}
              error={errors.assigneeId}
            />
          </div>
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