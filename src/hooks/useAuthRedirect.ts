
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isValidRole } from '@/utils/roleValidation';

export const useAuthRedirect = () => {
  const { user, userRole, loading, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't do anything if auth is not ready or still loading
    if (!isAuthReady || loading) return;

    const currentPath = location.pathname;
    
    // If user is not authenticated and trying to access protected routes
    if (!user && currentPath !== '/auth' && currentPath !== '/') {
      navigate('/auth', { replace: true });
      return;
    }

    // Only redirect authenticated users away from auth page if they have a valid role
    if (user && userRole && currentPath === '/auth') {
      // Validate the role and create route mapping for only our 6 retained roles
      const roleRoutes: Record<string, string> = {
        admin: '/admin',
        merchant: '/merchant',
        student: '/student',
        editor: '/editor',
        telecaller: '/telecaller',
        incharge: '/incharge'
      };
      
      // Only redirect if the role is valid and has a route
      if (isValidRole(userRole.name) && roleRoutes[userRole.name]) {
        const targetRoute = roleRoutes[userRole.name];
        navigate(targetRoute, { replace: true });
      }
    }
  }, [user, userRole, loading, isAuthReady, navigate, location.pathname]);

  return { user, userRole, loading, isAuthReady };
};
