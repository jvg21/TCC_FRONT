import React, { useState } from 'react';
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
  X
} from 'lucide-react';

export default function TaskManagementScreen() {
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Revisar documentação técnica', 
      priority: 'alta', 
      status: 'em andamento', 
      dueDate: '15/05/2025',
      completed: false,
      starred: true
    },
    { 
      id: 2, 
      title: 'Preparar apresentação para cliente', 
      priority: 'média', 
      status: 'pendente', 
      dueDate: '18/05/2025',
      completed: false,
      starred: false
    },
    { 
      id: 3, 
      title: 'Atualizar planilha de orçamento', 
      priority: 'baixa', 
      status: 'pendente', 
      dueDate: '20/05/2025',
      completed: false,
      starred: false
    },
    { 
      id: 4, 
      title: 'Enviar relatório mensal', 
      priority: 'alta', 
      status: 'concluída', 
      dueDate: '10/05/2025',
      completed: true,
      starred: false
    }
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'média',
    dueDate: '',
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'alta':
        return 'text-red-500';
      case 'média':
        return 'text-yellow-500';
      case 'baixa':
        return 'text-green-500';
      default:
        return '';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'alta':
        return <Flag className="w-4 h-4 text-red-500" />;
      case 'média':
        return <Flag className="w-4 h-4 text-yellow-500" />;
      case 'baixa':
        return <Flag className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const handleTaskToggle = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const handleStarToggle = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, starred: !task.starred } : task
    ));
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: tasks.length + 1,
        title: newTask.title,
        priority: newTask.priority,
        status: 'pendente',
        dueDate: newTask.dueDate || 'Sem data',
        completed: false,
        starred: false
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', priority: 'média', dueDate: '' });
      setShowAddTask(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">Minhas Tarefas</h1>
          <div className="ml-4 text-sm text-gray-500">{tasks.filter(t => !t.completed).length} pendentes</div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Buscar tarefas" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setShowAddTask(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nova Tarefa
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4" />
              <span>Data</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
              <Flag className="h-4 w-4" />
              <span>Prioridade</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          
          <div className="text-sm text-gray-500 flex items-center">
            <span className="mr-2">Ordenar por:</span>
            <button className="flex items-center space-x-1 font-medium text-gray-700">
              <span>Data de vencimento</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {tasks.map((task) => (
            <div key={task.id} className={`border-b border-gray-200 p-4 flex items-center ${task.completed ? 'bg-gray-50' : ''}`}>
              <div className="flex-shrink-0 mr-3">
                <button onClick={() => handleTaskToggle(task.id)} className="rounded-full">
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                  )}
                </button>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center">
                  <h3 className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  {task.starred && (
                    <Star className="ml-2 h-4 w-4 text-yellow-400 fill-current" />
                  )}
                </div>
                
                <div className="mt-1 flex items-center space-x-4 text-xs">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{task.dueDate}</span>
                  </div>
                  
                  <div className={`flex items-center ${getPriorityColor(task.priority)}`}>
                    {getPriorityIcon(task.priority)}
                    <span className="ml-1 capitalize">{task.priority}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize
                      ${task.status === 'concluída' ? 'bg-green-100 text-green-800' : ''}
                      ${task.status === 'em andamento' ? 'bg-blue-100 text-blue-800' : ''}
                      ${task.status === 'pendente' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 flex items-center space-x-2">
                <button 
                  onClick={() => handleStarToggle(task.id)} 
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Star className={`h-5 w-5 ${task.starred ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                </button>
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Nova Tarefa</h2>
              <button onClick={() => setShowAddTask(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o título da tarefa"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <select 
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="baixa">Baixa</option>
                  <option value="média">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de vencimento
                </label>
                <input 
                  type="date" 
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
