
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
      console.log('User not authenticated, redirecting to auth');
      navigate('/auth', { replace: true });
      return;
    }

    // Don't redirect if already on auth page - let AuthPage handle its own redirects
    if (currentPath === '/auth') {
      return;
    }

    // Only redirect authenticated users if they don't have access to current route
    if (user && userRole && isValidRole(userRole.name)) {
      const roleRoutes: Record<string, string> = {
        admin: '/admin',
        merchant: '/merchant',
        student: '/student',
        editor: '/editor',
        telecaller: '/telecaller',
        incharge: '/incharge'
      };
      
      const userRoute = roleRoutes[userRole.name];
      
      // If user is on a route they don't have access to, redirect to their proper route
      if (userRoute && currentPath !== userRoute && !currentPath.startsWith(userRoute)) {
        console.log(`Redirecting ${userRole.name} from ${currentPath} to ${userRoute}`);
        navigate(userRoute, { replace: true });
      }
    }
  }, [user, userRole, loading, isAuthReady, navigate, location.pathname]);

  return { user, userRole, loading, isAuthReady };
};
