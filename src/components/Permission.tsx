
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { isValidRole } from '@/utils/roleValidation';

interface PermissionProps {
  children: React.ReactNode;
  permission?: string;
  role?: string;
  fallback?: React.ReactNode;
}

const Permission: React.FC<PermissionProps> = ({ 
  children, 
  permission, 
  role, 
  fallback = null 
}) => {
  const { hasPermission, hasRole, isAdmin } = usePermissions();

  // Admin has access to everything
  if (isAdmin) {
    return <>{children}</>;
  }

  // Check permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check role - validate it's one of our 6 retained roles
  if (role && (!isValidRole(role) || !hasRole(role))) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default Permission;
