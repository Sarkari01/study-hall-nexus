
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

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
  const { hasPermission, hasRole } = usePermissions();

  // Check permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check role
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default Permission;
