import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'super_admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If requiring super_admin role specifically
  if (requiredRole === 'super_admin') {
    if (user.role !== 'super_admin') {
      return <Navigate to="/dashboard" replace />;
    }
  } else {
    // Default: require admin or super_admin
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;

