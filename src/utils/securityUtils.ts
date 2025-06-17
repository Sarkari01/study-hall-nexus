
import { ValidRole } from './roleValidation';

// Security constants
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

// Route access control
export const ROUTE_ACCESS: Record<string, { roles: ValidRole[]; permissions?: string[] }> = {
  '/admin': {
    roles: ['admin'],
    permissions: ['admin.users.view']
  },
  '/merchant': {
    roles: ['merchant', 'admin'],
    permissions: ['merchant.study_halls.view']
  },
  '/student': {
    roles: ['student', 'admin'],
    permissions: ['student.bookings.view']
  },
  '/editor': {
    roles: ['editor', 'admin'],
    permissions: ['editor.content.manage']
  },
  '/incharge': {
    roles: ['incharge', 'admin'],
    permissions: ['incharge.hall.view']
  },
  '/telecaller': {
    roles: ['telecaller', 'admin'],
    permissions: ['telecaller.leads.view']
  }
} as const;

// Check if user can access a route
export const canAccessRoute = (
  route: string, 
  userRole: string | null, 
  permissions: string[]
): boolean => {
  const routeConfig = ROUTE_ACCESS[route];
  if (!routeConfig) return false;

  // Admin can access everything
  if (userRole === 'admin') return true;

  // Check role access
  const hasRole = userRole && routeConfig.roles.includes(userRole as ValidRole);
  if (!hasRole) return false;

  // Check permissions if required
  if (routeConfig.permissions) {
    const hasPermission = routeConfig.permissions.some(permission => 
      permissions.includes(permission)
    );
    if (!hasPermission) return false;
  }

  return true;
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

// Validate session token format
export const isValidSessionToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  // Basic JWT format validation (header.payload.signature)
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

// Rate limiting helper
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return {
    isAllowed: (identifier: string): boolean => {
      const now = Date.now();
      const userAttempts = attempts.get(identifier);

      if (!userAttempts || now > userAttempts.resetTime) {
        attempts.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
      }

      if (userAttempts.count >= maxAttempts) {
        return false;
      }

      userAttempts.count++;
      return true;
    },
    
    reset: (identifier: string): void => {
      attempts.delete(identifier);
    }
  };
};
