
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface PermissionCheckerProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionChecker: React.FC<PermissionCheckerProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPermission();
  }, [permission]);

  const checkPermission = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setHasPermission(false);
        setLoading(false);
        return;
      }

      // Check if user has permission via the database function
      const { data, error } = await supabase
        .rpc('user_has_permission', { 
          user_id: user.id, 
          permission_name: permission 
        });

      if (error) {
        console.error('Permission check error:', error);
        setHasPermission(false);
      } else {
        setHasPermission(data || false);
      }
    } catch (error) {
      console.error('Error checking permission:', error);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-4 bg-gray-200 rounded"></div>;
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default PermissionChecker;
