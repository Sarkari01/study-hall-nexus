
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Merchant {
  id: string;
  full_name: string;
  business_name: string;
  business_phone: string;
  contact_number: string;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
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

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('merchant_profiles')
        .select(`
          *,
          study_halls (
            total_revenue,
            id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedMerchants = (data || []).map(merchant => ({
        ...merchant,
        verification_status: merchant.verification_status as 'unverified' | 'pending' | 'verified' | 'rejected',
        approval_status: merchant.approval_status as 'pending' | 'approved' | 'rejected',
        total_revenue: merchant.study_halls?.reduce((sum: number, hall: any) => sum + (hall.total_revenue || 0), 0) || 0,
        total_study_halls: merchant.study_halls?.length || 0
      }));

      setMerchants(typedMerchants);
      setError(null);
    } catch (err) {
      console.error('Error fetching merchants:', err);
      setError('Failed to fetch merchants');
      toast({
        title: "Error",
        description: "Failed to fetch merchants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMerchant = async (merchantId: string, updates: Partial<Merchant>) => {
    try {
      const { error } = await supabase
        .from('merchant_profiles')
        .update(updates)
        .eq('id', merchantId);

      if (error) throw error;

      setMerchants(prev => prev.map(merchant => 
        merchant.id === merchantId 
          ? { ...merchant, ...updates }
          : merchant
      ));

      toast({
        title: "Success",
        description: "Merchant updated successfully",
      });
    } catch (err) {
      console.error('Error updating merchant:', err);
      toast({
        title: "Error",
        description: "Failed to update merchant",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  return {
    merchants,
    loading,
    error,
    fetchMerchants,
    updateMerchant
  };
};
