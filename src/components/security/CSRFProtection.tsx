
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CSRFContextType {
  token: string | null;
  getHeaders: () => Record<string, string>;
}

const CSRFContext = createContext<CSRFContextType>({
  token: null,
  getHeaders: () => ({})
});

export const useCSRF = () => useContext(CSRFContext);

export const CSRFProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Generate CSRF token on mount
    const generateToken = () => {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    };

    const csrfToken = generateToken();
    setToken(csrfToken);
    
    // Store in session storage for validation
    sessionStorage.setItem('csrf_token', csrfToken);
  }, []);

  const getHeaders = () => {
    if (!token) return {};
    return {
      'X-CSRF-Token': token,
      'Content-Type': 'application/json'
    };
  };

  return (
    <CSRFContext.Provider value={{ token, getHeaders }}>
      {children}
    </CSRFContext.Provider>
  );
};
