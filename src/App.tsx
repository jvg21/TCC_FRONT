// src/App.tsx (Atualizado com inicialização do tema)
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ForgotPassword } from './components/pages/ForgotPassword';
import { Dashboard } from './components/pages/Dashboard';
import { useAuthStore } from './store/authStore';
import './i18n';
import { Login } from './components/pages/Login';
import { GroupManagement } from './components/pages/Group';
import { EmployeeManagement, UserManagement } from './components/pages/User';
import { AuthProvider } from './context/AuthProvider';
import { CompaniesManagement } from './components/pages/Companies';
import { Notification } from './components/utils/Notification';

// Inicialização do tema no carregamento da aplicação
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  // Inicializar o tema quando o aplicativo é carregado
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path='/companies/user'
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path='/companies/groups'
            element={
              <PrivateRoute>
                <GroupManagement />
              </PrivateRoute>
            }
          />
          <Route
            path='/companies'
            element={
              <PrivateRoute>
                <CompaniesManagement />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      <Notification />
    </AuthProvider>
  );
}

export default App;