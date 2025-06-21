
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  CSRFManager, 
  SessionManager, 
  RateLimiter, 
  AuditLogger,
  initializeSecurity 
} from '@/utils/securityEnhancements';
import { useAuth } from '@/contexts/AuthContext';

interface SecureAuthContextType {
  isSecurityInitialized: boolean;
  rateLimiter: RateLimiter;
  validateCSRF: (token: string) => boolean;
  logSecurityEvent: (event: string, details?: any) => Promise<void>;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export const useSecureAuth = () => {
  const context = useContext(SecureAuthContext);
  if (!context) {
    throw new Error('useSecureAuth must be used within SecureAuthProvider');
  }
  return context;
};

export const SecureAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSecurityInitialized, setIsSecurityInitialized] = useState(false);
  const [rateLimiter] = useState(() => new RateLimiter());
  const { user } = useAuth();

  useEffect(() => {
    // Initialize security measures
    initializeSecurity();
    setIsSecurityInitialized(true);
  }, []);

  useEffect(() => {
    // Log user session events
    if (user) {
      AuditLogger.logLogin(user.id, true);
    }

    return () => {
      if (user) {
        AuditLogger.logLogout(user.id);
      }
    };
  }, [user]);

  const validateCSRF = (token: string): boolean => {
    return CSRFManager.validateToken(token);
  };

  const logSecurityEvent = async (event: string, details?: any): Promise<void> => {
    if (user) {
      await AuditLogger.logSuspiciousActivity(user.id, event, details);
    }
  };

  const value = {
    isSecurityInitialized,
    rateLimiter,
    validateCSRF,
    logSecurityEvent
  };

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  );
};
