
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuditLogger, SecureValidator } from '@/utils/securityEnhancements';
import { useAuth } from '@/contexts/AuthContext';

interface SecureDataOptions {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  requireAuth?: boolean;
  logAccess?: boolean;
  validateData?: (data: any) => boolean;
}

interface SecureDataResult<T> {
  data: T[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSecureData = <T = any>(
  options: SecureDataOptions
): SecureDataResult<T> => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthReady } = useAuth();

  const fetchData = useCallback(async () => {
    if (options.requireAuth && !user) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Validate table name to prevent SQL injection
      const sanitizedTable = SecureValidator.sanitizeInput(options.table);
      if (sanitizedTable !== options.table) {
        throw new Error('Invalid table name');
      }

      // Start building the query - use proper typing
      let query = supabase.from(options.table as any).select(options.select || '*');

      // Apply filters securely
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (typeof value === 'string') {
            const sanitizedValue = SecureValidator.sanitizeInput(value);
            query = query.eq(key, sanitizedValue);
          } else {
            query = query.eq(key, value);
          }
        });
      }

      // Execute the query
      const { data: result, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      // Validate data if validator provided
      if (options.validateData && result) {
        const validData = result.filter(options.validateData);
        setData(validData);
      } else {
        setData(result);
      }

      // Log data access if required
      if (options.logAccess && user) {
        await AuditLogger.logDataAccess(user.id, options.table, 'read');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Secure data fetch error:', err);

      // Log suspicious activity for repeated failures
      if (user && errorMessage.includes('Invalid')) {
        await AuditLogger.logSuspiciousActivity(
          user.id,
          'invalid_data_access_attempt',
          { table: options.table, error: errorMessage }
        );
      }
    } finally {
      setLoading(false);
    }
  }, [options, user]);

  useEffect(() => {
    if (!options.requireAuth || isAuthReady) {
      fetchData();
    }
  }, [fetchData, options.requireAuth, isAuthReady]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
