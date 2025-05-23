// src/components/pages/TaskDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Plus,
  ChevronRight 
} from 'lucide-react';
import { Task, TaskStatus } from '../../types/task';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { TaskForm } from '../../config/task/TaskForm';
import { TaskViewer } from '../../config/task/TaskViewer';
import { ContentCard, PageLayout } from '../../components/common/PageLayout';

export const TaskDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { tasks, loading, fetchTasks } = useTaskStore();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filtrar tarefas por status e assignee
  const myTasks = tasks.filter(task => 
    task.isActive && task.assigneeId === user?.userId
  );
  
  const todoTasks = myTasks.filter(task => task.status === TaskStatus.TODO);
  const inProgressTasks = myTasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
  const reviewTasks = myTasks.filter(task => task.status === TaskStatus.REVIEW);
  const completedTasks = myTasks.filter(task => task.status === TaskStatus.DONE);

  // Ordenar por prioridade (do maior para o menor)
  const sortByPriority = (a: Task, b: Task) => b.priority - a.priority;

  const sortedTodo = [...todoTasks].sort(sortByPriority);
  const sortedInProgress = [...inProgressTasks].sort(sortByPriority);
  const sortedReview = [...reviewTasks].sort(sortByPriority);
  const sortedCompleted = [...completedTasks].sort(sortByPriority);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  const navigateToTasks = () => {
    navigate('/tasks');
  };

  const renderTaskItem = (task: Task) => {
    return (
      <div
        key={task.taskId}
        onClick={() => handleTaskClick(task)}
        className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
      >
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {task.title}
          </h4>
          <div 
            className={`h-2 w-2 rounded-full ${
              task.priority === 4 
                ? 'bg-red-500' 
                : task.priority === 3 
                ? 'bg-orange-500' 
                : task.priority === 2 
                ? 'bg-blue-500' 
                : 'bg-gray-500'
            }`}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {task.description}
        </p>
        {task.dueDate && (
          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    );
  };

  const renderTaskList = (tasks: Task[], icon: React.ReactNode, title: string, emptyMessage: string) => (
    <div>
      <div className="flex items-center mb-3">
        {icon}
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
          {title} ({tasks.length})
        </h3>
      </div>
      
      <div className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map(task => renderTaskItem(task))
        ) : (
          <div className="text-center p-4 text-sm text-gray-500 dark:text-gray-400 italic">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <PageLayout>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('taskDashboard')}
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={handleAddTask}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('addTask')}
          </button>
          
          <button
            onClick={navigateToTasks}
            className="flex items-center px-3 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {t('allTasks')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <ContentCard>
          {renderTaskList(
            sortedTodo,
            <Clock className="h-5 w-5 text-gray-500" />,
            t('todo'),
            t('noTodoTasks')
          )}
        </ContentCard>
        
        <ContentCard>
          {renderTaskList(
            sortedInProgress,
            <div className="h-5 w-5 flex items-center justify-center">
              <div className="animate-pulse h-3 w-3 bg-blue-500 rounded-full"></div>
            </div>,
            t('inProgress'),
            t('noInProgressTasks')
          )}
        </ContentCard>
        
        <ContentCard>
          {renderTaskList(
            sortedReview,
            <AlertCircle className="h-5 w-5 text-yellow-500" />,
            t('inReview'),
            t('noReviewTasks')
          )}
        </ContentCard>
        
        <ContentCard>
          {renderTaskList(
            sortedCompleted,
            <CheckCircle className="h-5 w-5 text-green-500" />,
            t('done'),
            t('noCompletedTasks')
          )}
        </ContentCard>
      </div>

      {/* Filtros e métricas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContentCard className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('upcomingDeadlines')}
          </h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            // Mostrar tarefas com prazo próximo (ordenadas por data de vencimento)
            <div>
              {myTasks
                .filter(task => task.dueDate && new Date(task.dueDate) > new Date() && task.status !== TaskStatus.DONE)
                .sort((a, b) => 
                  new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
                )
                .slice(0, 5)
                .map(task => renderTaskItem(task))}
              
              {myTasks.filter(
                task => task.dueDate && new Date(task.dueDate) > new Date() && task.status !== TaskStatus.DONE
              ).length === 0 && (
                <div className="text-center p-4 text-sm text-gray-500 dark:text-gray-400 italic">
                  {t('noUpcomingDeadlines')}
                </div>
              )}
            </div>
          )}
        </ContentCard>
        
        <ContentCard>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('taskStatistics')}
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">{t('totalTasks')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{myTasks.length}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">{t('completed')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {completedTasks.length} / {myTasks.length}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${myTasks.length > 0 ? (completedTasks.length / myTasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">{t('inProgress')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {inProgressTasks.length} / {myTasks.length}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${myTasks.length > 0 ? (inProgressTasks.length / myTasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">{t('pending')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {todoTasks.length} / {myTasks.length}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-yellow-500 rounded-full"
                  style={{ width: `${myTasks.length > 0 ? (todoTasks.length / myTasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </ContentCard>
      </div>

      {/* Modais */}
      {isAddModalOpen && (
        <TaskForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
      
      {isViewModalOpen && selectedTask && (
        <TaskViewer
          task={selectedTask}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onEdit={() => {
            setIsViewModalOpen(false);
            // Abrir modal de edição
            setSelectedTask(selectedTask);
            setIsAddModalOpen(true);
          }}
        />
      )}
    </PageLayout>
  );
};