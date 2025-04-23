export interface User {
  userId: number;
  name: string;
  email: string;
  password?: string;
  profile: number;
  preferredLanguage: number; 
  preferredTheme: number; 
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  companyId: number;
  isActive: boolean;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  getUser: (id: number) => User | undefined;
  addUser: (userData: Omit<User, 'userId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  updateUser: (id: number, userData: Partial<User>) => Promise<void>;
  toggleUser: (id: number) => Promise<void>;
  deleteUser?: (id: number) => Promise<void>;
}