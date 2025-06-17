
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { AlertCircle } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  permission, 
  fallback 
}) => {
  const { hasPermission, isAdmin } = usePermissions();

  // Admin has all permissions
  if (isAdmin || hasPermission(permission)) {
    return <>{children}</>;
  }

  return fallback || (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-gray-600">Insufficient permissions</p>
        <p className="text-sm text-gray-500">Required: {permission}</p>
      </div>
    </div>
  );
};

export default PermissionGuard;
