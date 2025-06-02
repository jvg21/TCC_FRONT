// Atualizando App.tsx para incluir rotas de tarefas

// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Dashboard } from './components/pages/Dashboard';
import { useAuthStore } from './store/authStore';
import './i18n';
import { Login } from './components/pages/Login';
import { AuthProvider } from './context/AuthProvider';
import { Notification } from './components/utils/Notification';
import { NotFound } from './components/pages/NotFound';
import { ForgotPassword } from './components/pages/ForgotPassword';
import { UserManagement } from './config/user/User';
import { GroupManagement } from './config/group/Group';
import { CompaniesManagement } from './config/company/Companies';
import { DocumentManagement } from './config/document/Document';
import { DocumentWorkspace } from './config/document/DocumentWorkspace';
import { TaskManagement } from './config/task/Task';
import { TaskDashboard } from './config/task/TaskDashboard';
import { DocumentVersions } from './config/document/DocumentVersions';

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

  const { user } = useAuthStore();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
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
                {user?.profile === 1 ? (
                  <CompaniesManagement />
                ) : (
                  <Navigate to="/dashboard" />
                )}
              </PrivateRoute>
            }
          />
          {/* Rotas para gerenciamento de documentos */}
          <Route
            path='/documents'
            element={
              <PrivateRoute>
                <DocumentManagement />
              </PrivateRoute>
            }
          />
          <Route
            path='/documents/workspace'
            element={
              <PrivateRoute>
                <DocumentWorkspace />
              </PrivateRoute>
            }
          />

          {/* Novas rotas para gerenciamento de tarefas */}
          <Route
            path='/tasks'
            element={
              <PrivateRoute>
                <TaskManagement />
              </PrivateRoute>
            }
          />
          <Route
            path='/documents/:documentId/versions'
            element={
              <PrivateRoute>
                <DocumentVersions />
              </PrivateRoute>
            }
          />
          <Route
            path='/tasks/dashboard'
            element={
              <PrivateRoute>
                <TaskDashboard />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rota para 404 - NotFound */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Notification />
    </AuthProvider>
  );
}

export default App;