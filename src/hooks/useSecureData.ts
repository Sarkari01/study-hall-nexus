
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

// Request deduplication cache
const requestCache = new Map<string, Promise<any>>();
const CACHE_DURATION = 5000; // 5 seconds

// Request tracking for debugging
const requestTracker = new Map<string, number>();

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
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoize stable values to prevent unnecessary re-renders
  const isAuthenticated = useMemo(() => !!user && isAuthReady, [user, isAuthReady]);
  const userRoleName = useMemo(() => userRole?.name, [userRole?.name]);
  
  console.log(`useSecureData(${table}): Auth state - user:`, !!user, 'role:', userRoleName, 'ready:', isAuthReady);

  // Create a stable cache key
  const cacheKey = useMemo(() => `${table}-${user?.id || 'anonymous'}`, [table, user?.id]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`useSecureData(${table}): Starting fetch`);
      
      // Track request frequency
      const currentTime = Date.now();
      const lastRequest = requestTracker.get(cacheKey) || 0;
      if (currentTime - lastRequest < 1000) {
        console.warn(`useSecureData(${table}): Request too frequent, throttling`);
        return;
      }
      requestTracker.set(cacheKey, currentTime);
      
      // Check authentication if required
      if (requireAuth && (!user || !isAuthReady)) {
        console.log(`useSecureData(${table}): User not authenticated or auth not ready`);
        if (isMountedRef.current) {
          setData([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      console.log(`useSecureData(${table}): User is authenticated, proceeding with fetch`);
      
      // Check if request is already in progress
      if (requestCache.has(cacheKey)) {
        console.log(`useSecureData(${table}): Using cached request`);
        const cachedData = await requestCache.get(cacheKey);
        if (isMountedRef.current) {
          setData(cachedData || []);
          setLoading(false);
        }
        return;
      }

      // Create new abort controller for this specific request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Create new request promise with better error handling
      const requestPromise = supabase  
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal)
        .then(async (result) => {
          console.log(`useSecureData(${table}): Supabase response:`, {
            data: result.data?.length || 0,
            error: result.error?.message,
            status: result.status,
            statusText: result.statusText
          });

          if (result.error) {
            // Enhanced error handling for RLS issues
            if (result.error.message?.includes('permission') || 
                result.error.message?.includes('RLS') || 
                result.error.message?.includes('policy')) {
              console.error(`useSecureData(${table}): RLS Policy Error:`, result.error);
              throw new Error(`Access denied - insufficient permissions for ${table}. User role: ${userRoleName}`);
            }
            throw result.error;
          }

          return result.data;
        });

      // Cache the request
      requestCache.set(cacheKey, requestPromise);
      
      // Clear cache after duration
      setTimeout(() => {
        requestCache.delete(cacheKey);
      }, CACHE_DURATION);

      const fetchedData = await requestPromise;

      console.log(`useSecureData(${table}): Fetch response:`, { 
        dataCount: fetchedData?.length || 0
      });

      // Check if component is still mounted and request wasn't cancelled
      if (!isMountedRef.current || controller.signal.aborted) {
        console.log(`useSecureData(${table}): Request was cancelled or component unmounted`);
        return;
      }

      // Validate data if validator provided
      const validData = (fetchedData || []).filter((item, index) => {
        if (validateData) {
          const isValid = validateData(item);
          if (!isValid) {
            console.warn(`useSecureData(${table}): Invalid data item filtered out at index ${index}:`, item);
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
      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        console.log(`useSecureData(${table}): Request was aborted`);
        return;
      }

      console.error(`useSecureData(${table}): Error in fetchData:`, err);
      if (isMountedRef.current) {
        let errorMessage = `Failed to fetch data from ${table}`;
        
        if (err.message?.includes('permission') || err.message?.includes('RLS') || err.message?.includes('policy')) {
          errorMessage = `Access denied - insufficient permissions for ${table}. User role: ${userRoleName || 'unknown'}`;
        } else if (err.message?.includes('Failed to fetch')) {
          errorMessage = 'Network error - please check your connection';
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
        } else {
          // For RLS errors, show more specific guidance
          toast({
            title: "Access Denied",
            description: `Unable to access ${table} data. Please check your permissions.`,
            variant: "destructive",
          });
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [table, user, isAuthReady, requireAuth, validateData, toast, cacheKey, userRoleName]);

  const create = useCallback(async (newData: Partial<T>) => {
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

      // Clear cache to refresh data
      requestCache.delete(cacheKey);

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
  }, [table, toast, cacheKey]);

  const update = useCallback(async (id: string, updates: Partial<T>) => {
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

      // Clear cache to refresh data
      requestCache.delete(cacheKey);

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
  }, [table, toast, cacheKey]);

  const deleteRecord = useCallback(async (id: string) => {
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

      // Clear cache to refresh data
      requestCache.delete(cacheKey);
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
  }, [table, toast, cacheKey]);

  const refresh = useCallback(() => {
    // Clear cache and refetch
    requestCache.delete(cacheKey);
    fetchData();
  }, [fetchData, cacheKey]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Only fetch when auth is ready and user is available (if required)
    if (isAuthReady && (!requireAuth || isAuthenticated)) {
      console.log(`useSecureData(${table}): Auth ready, fetching data`);
      fetchData();
    } else {
      console.log(`useSecureData(${table}): Auth not ready or user not available`, { 
        isAuthReady, 
        requireAuth, 
        isAuthenticated 
      });
      setLoading(false);
    }

    return () => {
      isMountedRef.current = false;
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Clear cache entry for this component
      requestCache.delete(cacheKey);
    };
  }, [isAuthenticated, isAuthReady, requireAuth, fetchData, cacheKey]);

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
