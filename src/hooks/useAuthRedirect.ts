
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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

    // Only redirect authenticated users away from auth page if they have a role
    if (user && userRole && currentPath === '/auth') {
      const roleRoutes = {
        admin: '/admin',
        merchant: '/merchant',
        student: '/student',
        editor: '/editor',
        telecaller: '/telecaller',
        incharge: '/incharge'
      };
      const targetRoute = roleRoutes[userRole.name as keyof typeof roleRoutes] || '/';
      navigate(targetRoute, { replace: true });
    }
  }, [user, userRole, loading, isAuthReady, navigate, location.pathname]);

  return { user, userRole, loading, isAuthReady };
};
