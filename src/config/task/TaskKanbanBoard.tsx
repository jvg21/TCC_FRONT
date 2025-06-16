import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Filter, 
  ChevronDown, 
  Star, 
  Flag,
  Check,
  X,
  User
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { TaskForm } from './TaskForm';
import { TaskViewer } from './TaskViewer';
import { PageLayout } from '../../components/common/PageLayout';
import { formatDateString } from '../../utils/formatDateString';

export const TaskKanbanBoard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { tasks, loading, fetchTasks, updateTask } = useTaskStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || task.priority.toString() === filterPriority;
    
    const matchesAssignee = filterAssignee === 'all' || 
                           (filterAssignee === 'me' && task.assigneeId === user?.userId) ||
                           (filterAssignee === 'unassigned' && !task.assigneeId);
    
    return matchesSearch && matchesPriority && matchesAssignee && task.isActive;
  });

  // Group tasks by status
  const tasksByStatus = {
    [TaskStatus.TODO]: filteredTasks.filter(task => task.status === TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: filteredTasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
    [TaskStatus.REVIEW]: filteredTasks.filter(task => task.status === TaskStatus.REVIEW),
    [TaskStatus.DONE]: filteredTasks.filter(task => task.status === TaskStatus.DONE)
  };

  const getPriorityColor = (priority: number) => {
    switch(priority) {
      case TaskPriority.URGENT:
        return 'text-red-500';
      case TaskPriority.HIGH:
        return 'text-orange-500';
      case TaskPriority.MEDIUM:
        return 'text-yellow-500';
      case TaskPriority.LOW:
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPriorityIcon = (priority: number) => {
    const colorClass = getPriorityColor(priority);
    return <Flag className={`w-4 h-4 ${colorClass}`} />;
  };

  const getPriorityLabel = (priority: number) => {
    switch(priority) {
      case TaskPriority.URGENT:
        return t('urgent');
      case TaskPriority.HIGH:
        return t('high');
      case TaskPriority.MEDIUM:
        return t('medium');
      case TaskPriority.LOW:
        return t('low');
      default:
        return t('unknown');
    }
  };

  const getStatusLabel = (status: number) => {
    switch(status) {
      case TaskStatus.TODO:
        return t('todo');
      case TaskStatus.IN_PROGRESS:
        return t('inProgress');
      case TaskStatus.REVIEW:
        return t('inReview');
      case TaskStatus.DONE:
        return t('done');
      default:
        return t('unknown');
    }
  };

  const getStatusColor = (status: number) => {
    switch(status) {
      case TaskStatus.TODO:
        return 'bg-gray-100 text-gray-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case TaskStatus.DONE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTaskStatusChange = async (taskId: number, newStatus: number) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    setViewingTask(task);
  };

  const renderTaskCard = (task: Task) => (
    <div
      key={task.taskId}
      onClick={() => handleTaskClick(task)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {task.title}
        </h3>
        <button className="p-1 rounded-full hover:bg-gray-100">
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {getPriorityIcon(task.priority)}
          <span className={getPriorityColor(task.priority)}>
            {getPriorityLabel(task.priority)}
          </span>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDateString(task.dueDate)}</span>
          </div>
        )}
      </div>
      
      {task.assigneeId && (
        <div className="mt-2 flex items-center">
          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
            <User className="h-3 w-3 text-gray-500" />
          </div>
          <span className="text-xs text-gray-600">
            {task.assignee?.name || `User ${task.assigneeId}`}
          </span>
        </div>
      )}
    </div>
  );

  const renderColumn = (status: number, title: string) => (
    <div className="flex-1 bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800 flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(status).split(' ')[0]}`}></span>
          {title}
          <span className="ml-2 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
            {tasksByStatus[status].length}
          </span>
        </h2>
        <button 
          onClick={() => setShowAddTask(true)}
          className="p-1 rounded-full hover:bg-gray-200"
        >
          <Plus className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tasksByStatus[status].map(task => renderTaskCard(task))}
        
        {tasksByStatus[status].length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            {t('noTasksInStatus')}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('taskBoard')}
            </h1>
            <div className="ml-4 text-sm text-gray-500">
              {filteredTasks.filter(t => t.status !== TaskStatus.DONE).length} {t('pending')}
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddTask(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('newTask')}
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder={t('searchTasks')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">{t('allPriorities')}</option>
            <option value={TaskPriority.URGENT.toString()}>{t('urgent')}</option>
            <option value={TaskPriority.HIGH.toString()}>{t('high')}</option>
            <option value={TaskPriority.MEDIUM.toString()}>{t('medium')}</option>
            <option value={TaskPriority.LOW.toString()}>{t('low')}</option>
          </select>
          
          <select 
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">{t('allAssignees')}</option>
            <option value="me">{t('myTasks')}</option>
            <option value="unassigned">{t('unassigned')}</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {renderColumn(TaskStatus.TODO, t('todo'))}
        {renderColumn(TaskStatus.IN_PROGRESS, t('inProgress'))}
        {renderColumn(TaskStatus.REVIEW, t('inReview'))}
        {renderColumn(TaskStatus.DONE, t('done'))}
      </div>

      {/* Modals */}
      {showAddTask && (
        <TaskForm
          isOpen={showAddTask}
          onClose={() => setShowAddTask(false)}
        />
      )}

      {viewingTask && (
        <TaskViewer
          task={viewingTask}
          isOpen={!!viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={() => {
            setSelectedTask(viewingTask);
            setViewingTask(null);
            setShowAddTask(true);
          }}
        />
      )}

      {selectedTask && (
        <TaskForm
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </PageLayout>
  );
};