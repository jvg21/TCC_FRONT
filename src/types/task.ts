// src/types/task.ts - Atualizado para o backend
import { User } from "./user";

export interface Task {
  taskId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  priority: number; // 1-4 conforme backend
  status: number; // 1-5 conforme backend
  assigneeId: number; // Assinalado para
  userId: number; // Criado por
  parentTaskId?: number | null; // Opcional
  isActive: boolean;
  
  // Relacionamentos opcionais para exibição
  user?: User; // Criador da tarefa
  assignee?: User; // Usuário designado
  parentTask?: Task; // Tarefa pai
}

// Enums para prioridade e status
export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4
}

export enum TaskStatus {
  TODO = 1,
  IN_PROGRESS = 2,
  REVIEW = 3,
  DONE = 4,
  ARCHIVED = 5
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Ações básicas do CRUD
  fetchTasks: () => Promise<void>;
  getTask: (id: number) => Task | undefined;
  addTask: (taskData: Omit<Task, 'taskId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  updateTask: (id: number, taskData: Partial<Task>) => Promise<void>;
  toggleTaskStatus: (id: number) => Promise<void>;
  
  // Ações adicionais
  assignTask: (taskId: number, userId: number) => Promise<void>;
  getTasksByAssignee: (userId: number) => Task[];
}