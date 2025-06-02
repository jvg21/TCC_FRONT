// src/config/task/TaskAssignment.tsx - Atualizado
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Task } from '../../types/task';
import { User } from '../../types/user';
import { useUserStore } from '../../store/userStore';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { Modal } from '../../components/forms/Modal';
import { Search, User as UserIcon, Check } from 'lucide-react';

interface TaskAssignmentProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskAssignment = ({ task, isOpen, onClose }: TaskAssignmentProps) => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuthStore();
  const { assignTask } = useTaskStore();
  const { users, fetchUsers } = useUserStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [assignee, setAssignee] = useState<User | null>(
    task.assigneeId ? users.find(user => user.userId === task.assigneeId) || null : null
  );
  
  // Buscar usuários ao montar o componente
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        await fetchUsers();
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (users.length === 0) {
      loadUsers();
    } else {
      // Atualizar o assignee se ele existir
      if (task.assigneeId) {
        const user = users.find(u => u.userId === task.assigneeId);
        if (user) {
          setAssignee(user);
        }
      }
    }
  }, [fetchUsers, users, task.assigneeId]);
  
  // Filtrar usuários ativos da mesma empresa
  const filteredUsers = users
    .filter(user => 
      user.isActive && 
      user.companyId === currentUser?.companyId &&
      (searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  
  const handleAssign = async (user: User) => {
    setLoading(true);
    try {
      await assignTask(task.taskId, user.userId);
      setAssignee(user);
      onClose();
    } catch (error) {
      console.error('Failed to assign task:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUnassign = async () => {
    setLoading(true);
    try {
      // Passar 0 como usuário para desassociar
      await assignTask(task.taskId, 0);
      setAssignee(null);
      onClose();
    } catch (error) {
      console.error('Failed to unassign task:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('assignTask')}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Informações da tarefa */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {t('task')}
          </h3>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {task.title}
          </p>
          
          {assignee && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                {t('currentlyAssignedTo')}:
              </span>
              <div className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                <UserIcon className="h-3 w-3 mr-1" />
                {assignee.name}
              </div>
            </div>
          )}
        </div>
        
        {/* Barra de pesquisa */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white transition duration-150 ease-in-out"
            placeholder={t('searchUsers')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Lista de usuários */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center p-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredUsers.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map(user => (
                  <li key={user.userId} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <button
                      onClick={() => handleAssign(user)}
                      className="w-full flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                          <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      {user.userId === assignee?.userId && (
                        <div className="text-green-600 dark:text-green-400">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                {searchTerm ? t('noUsersFound') : t('noUsers')}
              </div>
            )}
          </div>
        </div>
        
        {/* Ações */}
        <div className="flex justify-between">
          {assignee && (
            <button
              onClick={handleUnassign}
              className="px-4 py-2 border border-red-300 text-red-700 dark:border-red-700 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
              disabled={loading}
            >
              {t('unassign')}
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
            disabled={loading}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </Modal>
  );
};