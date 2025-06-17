
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isValidRole, ValidRole } from '@/utils/roleValidation';
import { Loader2, AlertCircle } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: ValidRole;
  requiredRoles?: ValidRole[];
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  requiredRole,
  requiredRoles,
  fallback 
}) => {
  const { userRole, loading, isAuthReady } = useAuth();

  // Show loading while auth is initializing
  if (!isAuthReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Admin has access to everything
  const isAdmin = userRole?.name === 'admin';
  if (isAdmin) {
    return <>{children}</>;
  }

  // Check single role requirement
  if (requiredRole && (!isValidRole(requiredRole) || userRole?.name !== requiredRole)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required role: {requiredRole}</p>
        </div>
      </div>
    );
  }

  // Check multiple roles requirement
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      isValidRole(role) && userRole?.name === role
    );
    
    if (!hasRequiredRole) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
            <p className="text-sm text-gray-500 mt-2">
              Required roles: {requiredRoles.join(', ')}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default RoleGuard;
