
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isValidRole } from '@/utils/roleValidation';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  requiredPermissions?: string[];
  fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermissions = [],
  fallbackPath = '/auth'
}) => {
  const { userRole, hasPermission, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Validate that allowed roles are actually valid system roles
  const validAllowedRoles = allowedRoles.filter(role => isValidRole(role));
  
  // Check if user has required role
  const hasRequiredRole = userRole && validAllowedRoles.includes(userRole.name);
  
  // Check if user has all required permissions
  const hasRequiredPermissions = requiredPermissions.every(permission => 
    hasPermission(permission)
  );

  if (!hasRequiredRole || !hasRequiredPermissions) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
