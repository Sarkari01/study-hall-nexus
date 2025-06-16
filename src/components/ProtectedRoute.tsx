
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { user, loading, userRole } = useAuth();

  console.log('ProtectedRoute - user:', !!user, 'loading:', loading, 'userRole:', userRole);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // If specific roles are required and user doesn't have the right role
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    console.log('User role mismatch, redirecting based on role:', userRole);
    // Redirect based on user's actual role
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'merchant':
        return <Navigate to="/merchant" replace />;
      case 'student':
        return <Navigate to="/student" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  console.log('Access granted to protected route');
  return <>{children}</>;
};

export default ProtectedRoute;
