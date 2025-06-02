// src/config/task/TaskViewer.tsx - Atualizado
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateString } from '../../utils/formatDateString';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { useUserStore } from '../../store/userStore';
import { useTaskStore } from '../../store/taskStore';
import { Modal } from '../../components/forms/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Edit
} from 'lucide-react';

interface TaskViewerProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const TaskViewer = ({ task, isOpen, onClose, onEdit }: TaskViewerProps) => {
  const { t } = useTranslation();
  const { users } = useUserStore();
  const { updateTask } = useTaskStore();
  const [isUpdating, setIsUpdating] = useState(false);

  // Obter informações relacionadas
  const assignee = users.find(user => user.userId === task.assigneeId);
  const creator = users.find(user => user.userId === task.userId);
  const parentTask = task.parentTaskId ? null : null; // Buscar tarefa pai se necessário

  // Status e prioridade
  const getStatusInfo = (status: number) => {
    switch (status) {
      case TaskStatus.TODO:
        return { label: t('todo'), variant: 'default', icon: <Clock className="h-5 w-5 text-gray-500" /> };
      case TaskStatus.IN_PROGRESS:
        return { label: t('inProgress'), variant: 'info', icon: <Clock className="h-5 w-5 text-blue-500" /> };
      case TaskStatus.REVIEW:
        return { label: t('inReview'), variant: 'warning', icon: <AlertCircle className="h-5 w-5 text-yellow-500" /> };
      case TaskStatus.DONE:
        return { label: t('done'), variant: 'success', icon: <CheckCircle className="h-5 w-5 text-green-500" /> };
      case TaskStatus.ARCHIVED:
        return { label: t('archived'), variant: 'danger', icon: <AlertTriangle className="h-5 w-5 text-red-500" /> };
      default:
        return { label: t('unknown'), variant: 'default', icon: <Clock className="h-5 w-5 text-gray-500" /> };
    }
  };

  const getPriorityInfo = (priority: number) => {
    switch (priority) {
      case TaskPriority.LOW:
        return { label: t('low'), variant: 'default' };
      case TaskPriority.MEDIUM:
        return { label: t('medium'), variant: 'info' };
      case TaskPriority.HIGH:
        return { label: t('high'), variant: 'warning' };
      case TaskPriority.URGENT:
        return { label: t('urgent'), variant: 'danger' };
      default:
        return { label: t('unknown'), variant: 'default' };
    }
  };

  const statusInfo = getStatusInfo(task.status);
  const priorityInfo = getPriorityInfo(task.priority);

  // Manipuladores para atualização de status
  const handleStatusChange = async (newStatus: number) => {
    if (task.status === newStatus) return;
    
    try {
      setIsUpdating(true);
      await updateTask(task.taskId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Manipuladores para atualização de prioridade
  const handlePriorityChange = async (newPriority: number) => {
    if (task.priority === newPriority) return;
    
    try {
      setIsUpdating(true);
      await updateTask(task.taskId, { priority: newPriority });
    } catch (error) {
      console.error('Failed to update priority:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Cabeçalho com status e prioridade */}
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            {statusInfo.icon}
            <StatusBadge
              label={statusInfo.label}
              variant={statusInfo.variant as any}
              size="md"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('priority')}:</span>
            <StatusBadge
              label={priorityInfo.label}
              variant={priorityInfo.variant as any}
              size="md"
            />
          </div>
        </div>
        
        {/* Descrição */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            {t('description')}
          </h3>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {task.description}
          </div>
        </div>
        
        {/* Detalhes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Informações de tempo */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> {t('dates')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('createdAt')}</span>
                <span className="text-gray-700 dark:text-gray-300">{formatDateString(task.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('updatedAt')}</span>
                <span className="text-gray-700 dark:text-gray-300">{formatDateString(task.updatedAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('dueDate')}</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {task.dueDate ? formatDateString(task.dueDate) : '-'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Informações de pessoas */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              <User className="h-4 w-4 mr-1" /> {t('people')}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('createdBy')}</span>
                <span className="text-gray-700 dark:text-gray-300">{creator?.name || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('assignee')}</span>
                <span className="text-gray-700 dark:text-gray-300">{assignee?.name || t('unassigned')}</span>
              </div>
              {task.parentTaskId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{t('parentTask')}</span>
                  <span className="text-gray-700 dark:text-gray-300">ID: {task.parentTaskId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Ações rápidas */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            {t('quickActions')}
          </h3>
          
          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('changeStatus')}
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(TaskStatus)
                .filter(status => typeof status === 'number')
                .map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status as number)}
                    disabled={isUpdating || task.status === status}
                    className={`px-3 py-1 rounded-md text-sm ${
                      task.status === status
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {getStatusInfo(status as number).label}
                  </button>
                ))}
            </div>
          </div>
          
          {/* Prioridade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('changePriority')}
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(TaskPriority)
                .filter(priority => typeof priority === 'number')
                .map(priority => (
                  <button
                    key={priority}
                    onClick={() => handlePriorityChange(priority as number)}
                    disabled={isUpdating || task.priority === priority}
                    className={`px-3 py-1 rounded-md text-sm ${
                      task.priority === priority
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {getPriorityInfo(priority as number).label}
                  </button>
                ))}
            </div>
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t('close')}
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Edit className="h-4 w-4 mr-1" />
            {t('edit')}
          </button>
        </div>
      </div>
    </Modal>
  );
};