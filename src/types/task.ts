// src/types/task.ts
import { User } from "./user";

export interface Task {
  taskId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: number; // Criador da tarefa
  assigneeId?: number; // Usuário designado para a tarefa
  groupId?: number; // Grupo associado à tarefa (opcional)
  isActive: boolean;
  user?: User; // Usuário que criou a tarefa (opcional, para exibição)
  assignee?: User; // Usuário designado (opcional, para exibição)
}

export enum TaskStatus {
  TODO = 1,
  IN_PROGRESS = 2,
  REVIEW = 3,
  DONE = 4,
  ARCHIVED = 5
}

export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4
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
  updateTaskStatus: (taskId: number, status: TaskStatus) => Promise<void>;
  updateTaskPriority: (taskId: number, priority: TaskPriority) => Promise<void>;
  getTasksByAssignee: (userId: number) => Task[];
  getTasksByGroup: (groupId: number) => Task[];
}