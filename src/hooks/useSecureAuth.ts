
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { isValidRole, ValidRole } from '@/utils/roleValidation';

export const useSecureAuth = () => {
  const { user, userRole, loading, isAuthReady, signOut } = useAuth();
  const { hasPermission, isAdmin } = usePermissions();

  const isAuthenticated = !!user && isAuthReady;
  
  const hasRole = (role: ValidRole): boolean => {
    if (!isValidRole(role)) return false;
    return isAdmin || userRole?.name === role;
  };

  const hasAnyRole = (roles: ValidRole[]): boolean => {
    return isAdmin || roles.some(role => hasRole(role));
  };

  const canAccess = (permission?: string, role?: ValidRole): boolean => {
    if (!isAuthenticated) return false;
    if (isAdmin) return true;
    
    if (permission && !hasPermission(permission)) return false;
    if (role && !hasRole(role)) return false;
    
    return true;
  };

  const secureSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error('Secure sign out failed:', error);
      // Force reload on sign out failure to clear any cached state
      window.location.href = '/auth';
    }
  };

  return {
    user,
    userRole,
    loading,
    isAuthReady,
    isAuthenticated,
    isAdmin,
    hasRole,
    hasAnyRole,
    hasPermission,
    canAccess,
    secureSignOut
  };
};
