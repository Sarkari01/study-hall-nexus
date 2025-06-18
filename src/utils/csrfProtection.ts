import { randomBytes } from 'crypto';

class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32;
  private static readonly SESSION_KEY = 'csrf_token';
  private static tokens = new Set<string>();

  static generateToken(): string {
    const token = randomBytes(this.TOKEN_LENGTH).toString('hex');
    this.tokens.add(token);
    
    // Store in session storage for client-side access
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.SESSION_KEY, token);
    }
    
    // Clean up old tokens (keep last 10)
    if (this.tokens.size > 10) {
      const tokensArray = Array.from(this.tokens);
      this.tokens.clear();
      tokensArray.slice(-10).forEach(t => this.tokens.add(t));
    }
    
    return token;
  }

  static validateToken(token: string): boolean {
    const isValid = this.tokens.has(token);
    
    // Remove token after validation (one-time use)
    if (isValid) {
      this.tokens.delete(token);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(this.SESSION_KEY);
      }
    }
    
    return isValid;
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(this.SESSION_KEY);
    }
    return null;
  }

  static clearToken(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.SESSION_KEY);
    }
  }

  static addTokenToHeaders(headers: Record<string, string> = {}): Record<string, string> {
    const token = this.getToken();
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
    return headers;
  }

  static addTokenToFormData(formData: FormData): void {
    const token = this.getToken();
    if (token) {
      formData.append('csrf_token', token);
    }
  }
}

export { CSRFProtection };

// React hook for CSRF protection
export const useCSRFProtection = () => {
  const generateToken = () => CSRFProtection.generateToken();
  const getToken = () => CSRFProtection.getToken();
  const addToHeaders = (headers?: Record<string, string>) => CSRFProtection.addTokenToHeaders(headers);
  const addToFormData = (formData: FormData) => CSRFProtection.addTokenToFormData(formData);

  return {
    generateToken,
    getToken,
    addToHeaders,
    addToFormData
  };
};
