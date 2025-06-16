
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthRedirect = () => {
  const { user, userRole, loading, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthReady || loading) return;

    const currentPath = location.pathname;
    
    // If user is not authenticated and not on auth page
    if (!user && currentPath !== '/auth') {
      navigate('/auth', { replace: true });
      return;
    }

    // If user is authenticated and on auth page, redirect to dashboard
    if (user && currentPath === '/auth') {
      if (userRole?.name) {
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
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, userRole, loading, isAuthReady, navigate, location.pathname]);

  return { user, userRole, loading, isAuthReady };
};
