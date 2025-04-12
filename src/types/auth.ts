import { User } from "./User";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}