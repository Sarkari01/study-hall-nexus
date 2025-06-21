
import { supabase } from '@/integrations/supabase/client';

// Security constants
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  CSRF_TOKEN_LENGTH: 32,
  PASSWORD_MIN_LENGTH: 8,
  SESSION_STORAGE_KEY: 'secure_session_data'
} as const;

// CSRF Token Management
export class CSRFManager {
  private static token: string | null = null;

  static generateToken(): string {
    const array = new Uint8Array(SECURITY_CONFIG.CSRF_TOKEN_LENGTH);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    this.token = token;
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = sessionStorage.getItem('csrf_token');
    }
    return this.token;
  }

  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken === token && token !== null;
  }

  static getHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) return {};
    
    return {
      'X-CSRF-Token': token,
      'Content-Type': 'application/json'
    };
  }

  static clearToken(): void {
    this.token = null;
    sessionStorage.removeItem('csrf_token');
  }
}

// Enhanced Input Validation
export class SecureValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`);
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim()
      .slice(0, 1000); // Limit input length
  }

  static validateUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone);
  }
}

// Rate Limiting
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private maxAttempts: number = SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS,
    private windowMs: number = SECURITY_CONFIG.LOCKOUT_DURATION
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts || now > userAttempts.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (userAttempts.count >= this.maxAttempts) {
      return false;
    }

    userAttempts.count++;
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  getRemainingTime(identifier: string): number {
    const userAttempts = this.attempts.get(identifier);
    if (!userAttempts) return 0;
    
    const now = Date.now();
    return Math.max(0, userAttempts.resetTime - now);
  }
}

// Session Security Manager
export class SessionManager {
  private static sessionData: Map<string, any> = new Map();

  static createSecureSession(userId: string, userData: any): string {
    const sessionId = crypto.randomUUID();
    const sessionData = {
      userId,
      userData,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };

    this.sessionData.set(sessionId, sessionData);
    
    // Store in secure storage
    const encryptedData = btoa(JSON.stringify(sessionData));
    sessionStorage.setItem(SECURITY_CONFIG.SESSION_STORAGE_KEY, encryptedData);
    
    return sessionId;
  }

  static validateSession(sessionId: string): boolean {
    const session = this.sessionData.get(sessionId);
    if (!session) return false;

    const now = Date.now();
    const isExpired = now - session.lastActivity > SECURITY_CONFIG.SESSION_TIMEOUT;
    
    if (isExpired) {
      this.destroySession(sessionId);
      return false;
    }

    // Update last activity
    session.lastActivity = now;
    return true;
  }

  static destroySession(sessionId: string): void {
    this.sessionData.delete(sessionId);
    sessionStorage.removeItem(SECURITY_CONFIG.SESSION_STORAGE_KEY);
  }

  static cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessionData) {
      if (now - session.lastActivity > SECURITY_CONFIG.SESSION_TIMEOUT) {
        this.destroySession(sessionId);
      }
    }
  }
}

// Audit Logger
export class AuditLogger {
  private static async logSecurityEvent(
    action: string,
    resourceType: string,
    resourceId?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    additionalData?: any
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          severity,
          context: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...additionalData
          },
          ip_address: await this.getClientIP()
        });

      if (error) {
        console.error('Failed to log audit event:', error);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }

  private static async getClientIP(): Promise<string> {
    try {
      // In production, this would be handled by your backend
      return 'client-side-unknown';
    } catch {
      return 'unknown';
    }
  }

  static async logLogin(userId: string, success: boolean, method: string = 'password'): Promise<void> {
    await this.logSecurityEvent(
      success ? 'login_success' : 'login_failure',
      'authentication',
      userId,
      success ? 'low' : 'medium',
      { method, success }
    );
  }

  static async logLogout(userId: string): Promise<void> {
    await this.logSecurityEvent(
      'logout',
      'authentication',
      userId,
      'low'
    );
  }

  static async logRoleChange(userId: string, oldRole: string, newRole: string, changedBy: string): Promise<void> {
    await this.logSecurityEvent(
      'role_change',
      'user_management',
      userId,
      'high',
      { oldRole, newRole, changedBy }
    );
  }

  static async logSuspiciousActivity(userId: string, activity: string, details?: any): Promise<void> {
    await this.logSecurityEvent(
      'suspicious_activity',
      'security',
      userId,
      'critical',
      { activity, details }
    );
  }

  static async logDataAccess(userId: string, resource: string, action: string): Promise<void> {
    await this.logSecurityEvent(
      `data_${action}`,
      resource,
      userId,
      'low'
    );
  }
}

// Security Headers Manager
export class SecurityHeaders {
  static getSecureHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };

    // Add CSRF token if available
    const csrfToken = CSRFManager.getToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    return headers;
  }
}

// Initialize security measures
export const initializeSecurity = (): void => {
  // Generate CSRF token
  CSRFManager.generateToken();
  
  // Set up session cleanup interval
  setInterval(() => {
    SessionManager.cleanupExpiredSessions();
  }, 60000); // Clean up every minute

  // Set up security headers for fetch requests
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const secureInit: RequestInit = {
      ...init,
      headers: {
        ...SecurityHeaders.getSecureHeaders(),
        ...init?.headers
      }
    };
    
    return originalFetch(input, secureInit);
  };
};
