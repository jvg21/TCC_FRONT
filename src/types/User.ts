export interface User {
  userId: number;
  name: string;
  email: string;
  password?: string; 
  profile?: number; 
  preferredLanguage?: string;
  preferredTheme?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date; 
  UserId?: string; 
  isActive: boolean;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  getUser: (id: number) => User | undefined;
  addUser: (UserData: Omit<User, 'UserId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  updateUser: (id: number, User: Partial<User>) => Promise<void>;
  toggleUser: (id: number) => Promise<void>;
}