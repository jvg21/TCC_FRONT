import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import './i18n';
import { SectorManagement } from './components/pages/SectorManagement';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { CompaniesManagement } from './pages/Companies';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
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
        {/* <Route 
          path='/adm' 
          element={
            <PrivateRoute>
              <EmployeeManagement/>
            </PrivateRoute>
          }
        /> */}
        <Route 
          path='/companies/sectors' 
          element={
            // <PrivateRoute>
              <SectorManagement/>
            // </PrivateRoute>
          }
        />
        <Route 
          path='/companies' 
          element={
            // <PrivateRoute>
              <CompaniesManagement/>
            // </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;