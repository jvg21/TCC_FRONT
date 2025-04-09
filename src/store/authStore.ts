import { create } from 'zustand';
import { AuthState } from '../types/auth';
import { User } from '../types/User';
import { z } from 'zod';

export const useAuthStore = create <AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    try {
      const response :any = await fetch('https://localhost:7198/Authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email,password)
      });
      
      if(response.erro){
        const errorData = await response.json();
        // Validate error response
        const validatedError = ErrorResponseSchema.safeParse(errorData);
        throw new Error(
          validatedError.success 
            ? validatedError.data.message 
            : `Authentication failed: ${response.status}`
        );
      }
      const userData = await response.json();
      // Validate user response data
      const validatedUser = UserResponseSchema.safeParse(userData);
      
      if (!validatedUser.success) {
        throw new Error("Invalid user data received from server");
      }
      
      const user: User = validatedUser.data;
      set({ user, isAuthenticated: true });
      return user;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        console.error('Validation error:', error.errors);
        throw new Error(error.errors[0].message);
      }
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
}));