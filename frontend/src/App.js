import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import WelcomePage from './pages/WelcomePage';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/welcome" replace /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/welcome" replace /> : <RegisterPage />} 
        />
        <Route 
          path="/verify-otp" 
          element={user ? <Navigate to="/welcome" replace /> : <VerifyOTPPage />} 
        />
        <Route 
          path="/welcome" 
          element={user ? <WelcomePage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? "/welcome" : "/login"} replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={user ? "/welcome" : "/login"} replace />} 
        />
      </Routes>
    </div>
  );
}

export default App;