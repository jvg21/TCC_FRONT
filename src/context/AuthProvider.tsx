// src/components/AuthProvider.tsx
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getCookie } from '../utils/cookies';

interface TokenPayload {
  nameid: string;
  unique_name: string;
  role: string;
  CompanyId: string;
  nbf: number;
  exp: number;
  iat: number;
}

/**
 * AuthProvider component is responsible for restoring the authentication state
 * from cookies when the application loads
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // If already authenticated through the store initialization, we don't need to do anything
    if (isAuthenticated && user) {
      setIsLoading(false);
      return;
    }

    // Check if we have a token in cookies
    const token = getCookie('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Done - the store initialization should have handled the token validation
    setIsLoading(false);
  }, [isAuthenticated, user]);

  if (isLoading) {
    // You could show a loading spinner here
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return <>{children}</>;
};