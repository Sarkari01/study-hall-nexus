
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthenticationGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  children,
  fallbackPath = '/auth'
}) => {
  const { user, loading, isAuthReady } = useAuth();
  const location = useLocation();

  // Show loading while auth is initializing
  if (!isAuthReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthenticationGuard;
