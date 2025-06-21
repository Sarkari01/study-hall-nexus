import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

// Define valid table names from the database schema
type TableName = keyof Database['public']['Tables'];

interface UseSecureDataOptions<T> {
  table: TableName;
  auditResource?: string;
  requireAuth?: boolean;
  validateData?: (data: any) => boolean;
}

export const useSecureData = <T>({
  table,
  auditResource,
  requireAuth = true,
  validateData
}: UseSecureDataOptions<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, userRole, isAuthReady } = useAuth();
  const isMountedRef = useRef(true);

  console.log(`useSecureData(${table}): Auth state - user:`, !!user, 'role:', userRole?.name, 'ready:', isAuthReady);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`useSecureData(${table}): Starting fetch`);
      
      // Check authentication if required
      if (requireAuth && (!user || !isAuthReady)) {
        console.log(`useSecureData(${table}): User not authenticated or auth not ready`);
        if (isMountedRef.current) {
          setData([]);
          setLoading(false);
          setError(null); // Don't set error for auth not ready
        }
        return;
      }

      console.log(`useSecureData(${table}): User is authenticated, proceeding with fetch`);
      
      // Fetch data - RLS policies will handle access control
      const { data: fetchedData, error: fetchError } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      console.log(`useSecureData(${table}): Fetch response:`, { 
        dataCount: fetchedData?.length || 0, 
        error: fetchError?.message 
      });

      if (fetchError) {
        console.error(`useSecureData(${table}): Error fetching data:`, fetchError);
        throw fetchError;
      }

      // Validate data if validator provided
      const validData = (fetchedData || []).filter(item => {
        if (validateData) {
          const isValid = validateData(item);
          if (!isValid) {
            console.warn(`useSecureData(${table}): Invalid data item filtered out:`, item);
          }
          return isValid;
        }
        return true;
      });

      console.log(`useSecureData(${table}): Final processed data count:`, validData.length);

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setData(validData as T[]);
        setError(null);
      }
    } catch (err: any) {
      console.error(`useSecureData(${table}): Error in fetchData:`, err);
      if (isMountedRef.current) {
        let errorMessage = `Failed to fetch data from ${table}`;
        
        if (err.message?.includes('permission') || err.message?.includes('RLS') || err.message?.includes('policy')) {
          errorMessage = 'Access denied - insufficient permissions';
        } else if (err.message) {
          errorMessage = `${errorMessage}: ${err.message}`;
        }
        
        setError(errorMessage);
        setData([]);
        
        // Only show toast for actual errors, not permission issues
        if (!err.message?.includes('permission') && !err.message?.includes('RLS')) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const create = async (newData: Partial<T>) => {
    try {
      console.log(`useSecureData(${table}): Creating new record:`, newData);
      
      const { data: createdData, error } = await supabase
        .from(table)
        .insert([newData])
        .select()
        .single();

      if (error) throw error;

      if (isMountedRef.current) {
        setData(prev => [createdData as T, ...prev]);
        
        toast({
          title: "Success",
          description: `Record created successfully`,
        });
      }

      return createdData;
    } catch (err: any) {
      console.error(`useSecureData(${table}): Error creating record:`, err);
      const errorMessage = err.message?.includes('permission') 
        ? 'Access denied - insufficient permissions to create'
        : 'Failed to create record';
      
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      throw err;
    }
  };

  const update = async (id: string, updates: Partial<T>) => {
    try {
      console.log(`useSecureData(${table}): Updating record:`, id, updates);
      
      const { data: updatedData, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (isMountedRef.current) {
        setData(prev => prev.map(item => 
          (item as any).id === id ? updatedData as T : item
        ));

        toast({
          title: "Success",
          description: `Record updated successfully`,
        });
      }

      return updatedData;
    } catch (err: any) {
      console.error(`useSecureData(${table}): Error updating record:`, err);
      const errorMessage = err.message?.includes('permission') 
        ? 'Access denied - insufficient permissions to update'
        : 'Failed to update record';
      
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      throw err;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      console.log(`useSecureData(${table}): Deleting record:`, id);
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (isMountedRef.current) {
        setData(prev => prev.filter(item => (item as any).id !== id));
        
        toast({
          title: "Success",
          description: `Record deleted successfully`,
        });
      }
    } catch (err: any) {
      console.error(`useSecureData(${table}): Error deleting record:`, err);
      const errorMessage = err.message?.includes('permission') 
        ? 'Access denied - insufficient permissions to delete'
        : 'Failed to delete record';
      
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      throw err;
    }
  };

  const refresh = () => {
    fetchData();
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    // Only fetch when auth is ready and user is available (if required)
    if (isAuthReady && (!requireAuth || user)) {
      console.log(`useSecureData(${table}): Auth ready, fetching data`);
      fetchData();
    } else {
      console.log(`useSecureData(${table}): Auth not ready or user not available`, { isAuthReady, requireAuth, user: !!user });
      setLoading(false);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user, userRole, isAuthReady, table, requireAuth]);

  return {
    data,
    loading,
    error,
    create,
    read: fetchData,
    update,
    delete: deleteRecord,
    refresh
  };
};
