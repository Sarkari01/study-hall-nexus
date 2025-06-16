
import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const isMountedRef = useRef(true);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      
      // Fetch merchants first
      const { data: merchantsData, error: merchantsError } = await supabase
        .from('merchant_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (merchantsError) throw merchantsError;

      // Fetch study halls separately
      const { data: studyHalls, error: studyHallsError } = await supabase
        .from('study_halls')
        .select('merchant_id, total_revenue, id');

      if (studyHallsError) throw studyHallsError;

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

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setMerchants(typedMerchants);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching merchants:', err);
      if (isMountedRef.current) {
        setError('Failed to fetch merchants');
        toast({
          title: "Error",
          description: "Failed to fetch merchants",
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
      console.error('Error updating merchant:', err);
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
    fetchMerchants();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    merchants,
    loading,
    error,
    fetchMerchants,
    updateMerchant
  };
};
