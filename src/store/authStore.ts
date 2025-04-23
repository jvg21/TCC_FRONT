import { create } from 'zustand';
import { AuthState } from '../types/auth';
import { User } from '../types/user';
import { getNotificationStore } from './notificationStore';
import { jwtDecode } from 'jwt-decode';
import { setCookie, getCookie, eraseCookie } from '../utils/cookies';

interface ApiResponse {
  mensagem: string;
  objeto: any;
  erro: boolean;
}

interface TokenPayload {
  nameid: string; // id do usuário
  unique_name: string; // nome do usuário
  role: string; // profile do usuário (1, 2 ou 3)
  CompanyId: string; // ID da empresa
  nbf: number;
  exp: number;
  iat: number;
}

// Check if user is already authenticated on store initialization
const getInitialAuthState = (): { user: User | null, isAuthenticated: boolean } => {
  const token = getCookie('authToken');
  
  if (token) {
    try {
      const tokenPayload: TokenPayload = jwtDecode(token);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (tokenPayload.exp < currentTime) {
        eraseCookie('authToken');
        return { user: null, isAuthenticated: false };
      }
      
      // Extract user information from token
      const user: User = {
        userId: parseInt(tokenPayload.nameid),
        name: tokenPayload.unique_name,
        email: '', // Não temos o email no token
        profile: parseInt(tokenPayload.role),
        companyId: parseInt(tokenPayload.CompanyId),
        preferredLanguage: 1, // Valores padrão
        preferredTheme: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return { user, isAuthenticated: true };
    } catch (err) {
      console.error('Error decoding token:', err);
      eraseCookie('authToken');
    }
  }
  
  return { user: null, isAuthenticated: false };
};

const initialState = getInitialAuthState();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user,
  isAuthenticated: initialState.isAuthenticated,
  
  login: async (email: string, password: string) => {
    try {
      const response = await fetch('https://localhost:7198/Authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "login": email, password })
      });
      
      const data: ApiResponse = await response.json();
      
      if (data.erro) {
        // API indica erro
        throw new Error(data.mensagem || 'Falha na autenticação');
      }
      
      // Sucesso - verificar o token
      if (!data.objeto?.token) {
        throw new Error('Falha na autenticação');
      }
      
      // Decodificar o token JWT
      try {
        const tokenPayload: TokenPayload = jwtDecode(data.objeto.token);
        
        // Extrair informações do usuário do token
        const user: User = {
          userId: parseInt(tokenPayload.nameid),
          name: tokenPayload.unique_name,
          email: email,
          profile: parseInt(tokenPayload.role),
          companyId: parseInt(tokenPayload.CompanyId),
          preferredLanguage: 1, // Valores padrão
          preferredTheme: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Store token in cookies 
        setCookie('authToken', data.objeto.token);
        
        // Atualizar o estado
        set({ user, isAuthenticated: true });
        
        // Mostrar mensagem de sucesso
        getNotificationStore().showNotification(data.mensagem || 'Login realizado com sucesso', 'success');
        
        return user;

      } catch (err) {
        console.error('Erro ao decodificar token:', err);
        throw new Error('Erro ao processar dados de autenticação');
      }

    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error){
        getNotificationStore().showError(error.message);
      }
      
      throw error;
    }
  },
  
  logout: () => {
    eraseCookie('authToken');
    
    set({ user: null, isAuthenticated: false });
    getNotificationStore().showNotification("Você foi desconectado", "info");
  },
  
  resetPassword: async (email: string) => {
    try {
      const response = await fetch('https://localhost:7198/ResetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const data: ApiResponse = await response.json();
      
      if (data.erro) {
        // API indica erro
        getNotificationStore().showError(data.mensagem || 'Falha na redefinição de senha');
        throw new Error(data.mensagem || 'Falha na redefinição de senha');
      }
      
      // Mostrar mensagem de sucesso
      getNotificationStore().showNotification(data.mensagem || "Email de redefinição de senha enviado", "success");
      
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (error instanceof Error && !error.message.includes('Falha na redefinição')) {
        getNotificationStore().showError("Ocorreu um erro inesperado durante a redefinição de senha");
      }
      
      throw error;
    }
  }
}));