import { create } from 'zustand';
import { AuthState } from '../types/auth';
import { User } from '../types/User';
import { getNotificationStore } from './notificationStore';
import { jwtDecode } from 'jwt-decode';

interface ApiResponse {
  mensagem: string;
  objeto: any;
  erro: boolean;
}

interface TokenPayload {
  nameid: string; // id do usuário
  unique_name: string; // nome do usuário
  role: string;
  CompanyId: string;
  nbf: number;
  exp: number;
  iat: number;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
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
          id: tokenPayload.nameid,
          name: tokenPayload.unique_name,
          //profile
          //companyid
          email: email // O token não tem o email, então usamos o que o usuário digitou
        };
        
        // Armazenar o token no localStorage para uso em futuras requisições
        localStorage.setItem('authToken', data.objeto.token);
        
        // Atualizar o estado
        set({ user, isAuthenticated: true });
        
        // Mostrar mensagem de sucesso
        getNotificationStore().showNotification(data.mensagem || 'Login realizado com sucesso', 'success');
        
        return user;

      } catch (err) {
        console.error('Erro ao decodificar token:', err);
        // getNotificationStore().showError('Erro ao processar dados de autenticação');
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
    // Remover token do localStorage
    localStorage.removeItem('authToken');
    
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
      
      // Se a mensagem de erro ainda não foi exibida
      if (error instanceof Error && !error.message.includes('Falha na redefinição')) {
        getNotificationStore().showError("Ocorreu um erro inesperado durante a redefinição de senha");
      }
      
      throw error;
    }
  }
}));