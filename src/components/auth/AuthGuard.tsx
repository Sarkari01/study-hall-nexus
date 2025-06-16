
import React from 'react';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { isValidRole } from '@/utils/roleValidation';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole,
  fallback = null 
}) => {
  const { user, userRole, loading, isAuthReady } = useAuthRedirect();

  // Show loading while auth is initializing
  if (!isAuthReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, AuthRedirect hook will handle navigation
  if (!user) {
    return fallback ? <>{fallback}</> : null;
  }

  // Admin has access to everything
  const isAdmin = userRole?.name === 'admin';
  if (isAdmin) {
    return <>{children}</>;
  }

  // Check role requirement - validate it's one of our 6 retained roles
  if (requiredRole && (!isValidRole(requiredRole) || userRole?.name !== requiredRole)) {
    return fallback ? <>{fallback}</> : (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
