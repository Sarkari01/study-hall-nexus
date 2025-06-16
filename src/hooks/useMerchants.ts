
import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface Merchant {
  id: string;
  full_name: string;
  business_name: string;
  business_phone: string;
  contact_number: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  business_address: any;
  total_revenue?: number;
  total_study_halls?: number;
}

export const useMerchants = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, userRole, isAuthReady } = useAuth();
  const isMountedRef = useRef(true);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useMerchants: Starting fetch, user:', user?.id, 'role:', userRole?.name);
      
      // Check authentication
      if (!user || !isAuthReady) {
        console.log('useMerchants: User not authenticated or auth not ready');
        if (isMountedRef.current) {
          setMerchants([]);
          setError('Authentication required');
          setLoading(false);
        }
        return;
      }

      // Check admin role
      if (userRole?.name !== 'admin') {
        console.log('useMerchants: User does not have admin role:', userRole?.name);
        if (isMountedRef.current) {
          setMerchants([]);
          setError('Admin access required');
          setLoading(false);
        }
        return;
      }
      
      // Fetch merchants first
      const { data: merchantsData, error: merchantsError } = await supabase
        .from('merchant_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('useMerchants: Merchant profiles response:', { data: merchantsData, error: merchantsError });

      if (merchantsError) {
        console.error('useMerchants: Error fetching merchants:', merchantsError);
        throw merchantsError;
      }

      // Fetch study halls separately to get revenue data
      const { data: studyHalls, error: studyHallsError } = await supabase
        .from('study_halls')
        .select('merchant_id, total_revenue, id');

      if (studyHallsError) {
        console.error('useMerchants: Error fetching study halls:', studyHallsError);
        // Don't throw error for study halls, just log it
      }

      // Combine the data
      const typedMerchants = (merchantsData || []).map(merchant => {
        const merchantStudyHalls = studyHalls?.filter(hall => hall.merchant_id === merchant.id) || [];
        const totalRevenue = merchantStudyHalls.reduce((sum: number, hall: any) => sum + (hall.total_revenue || 0), 0);
        const totalStudyHalls = merchantStudyHalls.length;

        return {
          ...merchant,
          approval_status: merchant.approval_status as 'pending' | 'approved' | 'rejected',
          total_revenue: totalRevenue,
          total_study_halls: totalStudyHalls
        };
      });

      console.log('useMerchants: Final processed merchants:', typedMerchants);

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setMerchants(typedMerchants);
        setError(null);
        
        toast({
          title: "Success",
          description: `Loaded ${typedMerchants.length} merchants`,
        });
      }
    } catch (err) {
      console.error('useMerchants: Error in fetchMerchants:', err);
      if (isMountedRef.current) {
        setError('Failed to fetch merchants');
        setMerchants([]);
        toast({
          title: "Error",
          description: "Failed to fetch merchants. Please check your permissions.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const updateMerchant = async (merchantId: string, updates: Partial<Merchant>) => {
    try {
      console.log('useMerchants: Updating merchant:', merchantId, updates);
      
      const { error } = await supabase
        .from('merchant_profiles')
        .update(updates)
        .eq('id', merchantId);

      if (error) throw error;

      if (isMountedRef.current) {
        setMerchants(prev => prev.map(merchant => 
          merchant.id === merchantId 
            ? { ...merchant, ...updates }
            : merchant
        ));

        toast({
          title: "Success",
          description: "Merchant updated successfully",
        });
      }
    } catch (err) {
      console.error('useMerchants: Error updating merchant:', err);
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to update merchant",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    // Only fetch when auth is ready
    if (isAuthReady) {
      fetchMerchants();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user, userRole, isAuthReady]);

  return {
    merchants,
    loading,
    error,
    fetchMerchants,
    updateMerchant
  };
};
