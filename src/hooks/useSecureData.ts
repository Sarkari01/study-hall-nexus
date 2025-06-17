
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useAuditLog } from './useAuditLog';
import { validateUUID, isObject } from '@/utils/typeGuards';

interface SecureDataOptions {
  table: string;
  auditResource?: string;
  requireAuth?: boolean;
  validateData?: (data: any) => boolean;
}

interface UseSecureDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  create: (data: Omit<T, 'id' | 'created_at' | 'updated_at'>) => Promise<T | null>;
  read: (filters?: Record<string, any>) => Promise<T[]>;
  update: (id: string, updates: Partial<T>) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export const useSecureData = <T extends Record<string, any>>(
  options: SecureDataOptions
): UseSecureDataReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, isAuthReady } = useAuth();
  const { logAction } = useAuditLog();

  const validateAccess = useCallback(() => {
    if (options.requireAuth !== false && (!user || !isAuthReady)) {
      throw new Error('Authentication required');
    }
    return true;
  }, [user, isAuthReady, options.requireAuth]);

  const validateInput = useCallback((data: any): boolean => {
    if (options.validateData && !options.validateData(data)) {
      throw new Error('Data validation failed');
    }
    return true;
  }, [options.validateData]);

  const create = useCallback(async (inputData: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T | null> => {
    try {
      validateAccess();
      validateInput(inputData);
      setLoading(true);
      setError(null);

      const { data: result, error: dbError } = await supabase
        .from(options.table as any)
        .insert([inputData])
        .select()
        .single();

      if (dbError) throw dbError;

      setData(prev => [result as T, ...prev]);

      if (options.auditResource) {
        await logAction({
          action: 'CREATE',
          resource_type: options.auditResource,
          resource_id: result.id,
          new_values: inputData,
          severity: 'medium'
        });
      }

      toast({
        title: "Success",
        description: `${options.auditResource || 'Record'} created successfully`,
      });

      return result as T;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create record';
      setError(errorMessage);
      console.error(`Error creating ${options.table}:`, err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    } finally {
      setLoading(false);
    }
  }, [validateAccess, validateInput, options, logAction, toast]);

  const read = useCallback(async (filters?: Record<string, any>): Promise<T[]> => {
    try {
      validateAccess();
      setLoading(true);
      setError(null);

      let query = supabase.from(options.table as any).select('*');

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data: result, error: dbError } = await query
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      const typedResult = (result || []) as T[];
      setData(typedResult);
      return typedResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch records';
      setError(errorMessage);
      console.error(`Error reading ${options.table}:`, err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return [];
    } finally {
      setLoading(false);
    }
  }, [validateAccess, options, toast]);

  const update = useCallback(async (id: string, updates: Partial<T>): Promise<boolean> => {
    try {
      validateAccess();
      validateInput(updates);
      
      if (!validateUUID(id)) {
        throw new Error('Invalid ID format');
      }

      setLoading(true);
      setError(null);

      // Get current record for audit
      const { data: currentRecord } = await supabase
        .from(options.table as any)
        .select('*')
        .eq('id', id)
        .single();

      const { data: result, error: dbError } = await supabase
        .from(options.table as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (dbError) throw dbError;

      setData(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));

      if (options.auditResource) {
        await logAction({
          action: 'UPDATE',
          resource_type: options.auditResource,
          resource_id: id,
          old_values: currentRecord,
          new_values: updates,
          severity: 'medium'
        });
      }

      toast({
        title: "Success",
        description: `${options.auditResource || 'Record'} updated successfully`,
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update record';
      setError(errorMessage);
      console.error(`Error updating ${options.table}:`, err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    } finally {
      setLoading(false);
    }
  }, [validateAccess, validateInput, options, logAction, toast]);

  const deleteRecord = useCallback(async (id: string): Promise<boolean> => {
    try {
      validateAccess();
      
      if (!validateUUID(id)) {
        throw new Error('Invalid ID format');
      }

      setLoading(true);
      setError(null);

      // Get current record for audit
      const { data: currentRecord } = await supabase
        .from(options.table as any)
        .select('*')
        .eq('id', id)
        .single();

      const { error: dbError } = await supabase
        .from(options.table as any)
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setData(prev => prev.filter(item => item.id !== id));

      if (options.auditResource) {
        await logAction({
          action: 'DELETE',
          resource_type: options.auditResource,
          resource_id: id,
          old_values: currentRecord,
          severity: 'high'
        });
      }

      toast({
        title: "Success",
        description: `${options.auditResource || 'Record'} deleted successfully`,
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete record';
      setError(errorMessage);
      console.error(`Error deleting ${options.table}:`, err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    } finally {
      setLoading(false);
    }
  }, [validateAccess, options, logAction, toast]);

  const refresh = useCallback(async () => {
    await read();
  }, [read]);

  return {
    data,
    loading,
    error,
    create,
    read,
    update,
    delete: deleteRecord,
    refresh
  };
};
