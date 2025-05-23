// src/config/task/TaskColumns.tsx
import { Column } from '../../components/common/DataTable';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { ActionButtons } from '../../components/common/ActionButtons';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDateString } from '../../utils/formatDateString';
import { User } from 'lucide-react';

interface GetColumnsProps {
  onEdit: (task: Task) => void;
  onToggle: (task: Task) => void;
  onViewDetails: (task: Task) => void;
  onAssign: (task: Task) => void;
  currentUserId: number;
  isEmployee: boolean;
}

export const getTaskColumns = ({
  onEdit,
  onToggle,
  onViewDetails,
  onAssign,
  currentUserId,
  isEmployee
}: GetColumnsProps): Column<Task>[] => {
  const { t } = useLanguage();

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return <StatusBadge label={t('todo')} variant="default" />;
      case TaskStatus.IN_PROGRESS:
        return <StatusBadge label={t('inProgress')} variant="info" />;
      case TaskStatus.REVIEW:
        return <StatusBadge label={t('inReview')} variant="warning" />;
      case TaskStatus.DONE:
        return <StatusBadge label={t('done')} variant="success" />;
      case TaskStatus.ARCHIVED:
        return <StatusBadge label={t('archived')} variant="danger" />;
      default:
        return <StatusBadge label={t('unknown')} variant="default" />;
    }
  };
  
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return <StatusBadge label={t('low')} variant="default" />;
      case TaskPriority.MEDIUM:
        return <StatusBadge label={t('medium')} variant="info" />;
      case TaskPriority.HIGH:
        return <StatusBadge label={t('high')} variant="warning" />;
      case TaskPriority.URGENT:
        return <StatusBadge label={t('urgent')} variant="danger" />;
      default:
        return <StatusBadge label={t('unknown')} variant="default" />;
    }
  };

  const baseColumns: Column<Task>[] = [
    {
      header: t('title'),
      accessor: (task) => (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {task.title}
        </div>
      )
    },
    {
      header: t('status'),
      accessor: (task) => getStatusBadge(task.status)
    },
    {
      header: t('priority'),
      accessor: (task) => getPriorityBadge(task.priority)
    },
    {
      header: t('assignee'),
      accessor: (task) => (
        <div className="flex items-center">
          {task.assignee ? (
            <div className="text-sm text-gray-500 dark:text-gray-300">
              {task.assignee.name}
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAssign(task);
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              title={t('assignTask')}
            >
              <User className="h-5 w-5 mr-1" />
              <span className="text-sm">{t('assign')}</span>
            </button>
          )}
        </div>
      )
    },
    {
      header: t('dueDate'),
      accessor: (task) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {task.dueDate ? formatDateString(task.dueDate) : '-'}
        </div>
      )
    },
    {
      header: t('active'),
      accessor: (task) => (
        <StatusBadge
          label={task.isActive ? t('active') : t('inactive')}
          variant={task.isActive ? 'success' : 'danger'}
        />
      )
    }
  ];

  // Adicionar coluna de ações (se não for funcionário ou se for o criador da tarefa)
  baseColumns.push({
    header: t('actions'),
    accessor: (task) => {
      // Usuário só pode editar/ativar/desativar tarefas que ele criou, a menos que seja administrador ou gerente
      const canModify = task.userId === currentUserId || !isEmployee;
      
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(task)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            title={t('viewDetails')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          
          <ActionButtons
            onEdit={canModify ? () => onEdit(task) : undefined}
            onToggle={canModify ? () => onToggle(task) : undefined}
            isActive={task.isActive}
            showToggle={canModify}
            showDelete={false}
            editTooltip={t('editTask')}
          />
        </div>
      );
    },
    className: 'text-right'
  });
  
  return baseColumns;
};