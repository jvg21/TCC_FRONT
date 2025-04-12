import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ForgotPassword } from './components/pages/ForgotPassword';
import { Dashboard } from './components/pages/Dashboard';
import { useAuthStore } from './store/authStore';
import './i18n';
import { Login } from './components/pages/Login';
import { Notification } from './components/Notification';
import { SectorManagement } from './components/pages/SectorManagement';
import { CompaniesManagement } from './pages/Companies';
import { EmployeeManagement } from './components/pages/User';


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
        <>
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
          path='/companies/employee' 
          element={
            <PrivateRoute>
              <EmployeeManagement/>
            </PrivateRoute>
          }
        />
        <Route 
          path='/companies/sectors' 
          element={
            <PrivateRoute>
              <SectorManagement/>
            </PrivateRoute>
          }
        />
        <Route 
          path='/companies' 
          element={
            <PrivateRoute>
              <CompaniesManagement/>
             </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
        <Notification />
        </>

  );
}

export default App;