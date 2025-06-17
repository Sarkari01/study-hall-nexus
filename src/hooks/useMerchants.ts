
import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface Merchant {
  id: string;
  user_id?: string;
  full_name: string;
  business_name: string;
  business_phone: string;
  contact_number: string;
  email?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  verification_status: 'unverified' | 'verified' | 'rejected';
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  business_address: any;
  communication_address?: any;
  bank_account_details?: any;
  incharge_name?: string;
  incharge_designation?: string;
  incharge_phone?: string;
  incharge_email?: string;
  incharge_address?: any;
  refundable_security_deposit?: number;
  notes?: string;
  total_revenue?: number;
  total_study_halls?: number;
}

interface CreateMerchantData {
  full_name: string;
  business_name: string;
  business_phone: string;
  contact_number: string;
  email: string;
  business_address: any;
  communication_address?: any;
  bank_account_details?: any;
  incharge_name?: string;
  incharge_designation?: string;
  incharge_phone?: string;
  incharge_email?: string;
  incharge_address?: any;
  refundable_security_deposit?: number;
  approval_status?: 'pending' | 'approved' | 'rejected';
  notes?: string;
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
      
      if (!user || !isAuthReady) {
        console.log('useMerchants: User not authenticated or auth not ready');
        if (isMountedRef.current) {
          setMerchants([]);
          setError('Authentication required');
          setLoading(false);
        }
        return;
      }

      if (userRole?.name !== 'admin') {
        console.log('useMerchants: User does not have admin role:', userRole?.name);
        if (isMountedRef.current) {
          setMerchants([]);
          setError('Admin access required');
          setLoading(false);
        }
        return;
      }
      
      const { data: merchantsData, error: merchantsError } = await supabase
        .from('merchant_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('useMerchants: Merchant profiles response:', { data: merchantsData, error: merchantsError });

      if (merchantsError) {
        console.error('useMerchants: Error fetching merchants:', merchantsError);
        throw merchantsError;
      }

      const { data: studyHalls, error: studyHallsError } = await supabase
        .from('study_halls')
        .select('merchant_id, total_revenue, id');

      if (studyHallsError) {
        console.error('useMerchants: Error fetching study halls:', studyHallsError);
      }

      const typedMerchants = (merchantsData || []).map(merchant => {
        const merchantStudyHalls = studyHalls?.filter(hall => hall.merchant_id === merchant.id) || [];
        const totalRevenue = merchantStudyHalls.reduce((sum: number, hall: any) => sum + (hall.total_revenue || 0), 0);
        const totalStudyHalls = merchantStudyHalls.length;

        return {
          ...merchant,
          approval_status: merchant.approval_status as 'pending' | 'approved' | 'rejected',
          verification_status: merchant.verification_status as 'unverified' | 'verified' | 'rejected',
          total_revenue: totalRevenue,
          total_study_halls: totalStudyHalls
        };
      });

      console.log('useMerchants: Final processed merchants:', typedMerchants);

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

  const createMerchant = async (merchantData: CreateMerchantData) => {
    try {
      console.log('useMerchants: Creating merchant:', merchantData);
      
      const { data, error } = await supabase
        .from('merchant_profiles')
        .insert([{
          ...merchantData,
          onboarding_completed: false,
          verification_status: 'unverified',
          approval_status: merchantData.approval_status || 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      const newMerchant: Merchant = {
        ...data,
        approval_status: data.approval_status as 'pending' | 'approved' | 'rejected',
        verification_status: data.verification_status as 'unverified' | 'verified' | 'rejected',
        total_revenue: 0,
        total_study_halls: 0
      };

      if (isMountedRef.current) {
        setMerchants(prev => [newMerchant, ...prev]);

        toast({
          title: "Success",
          description: "Merchant created successfully",
        });
      }

      return newMerchant;
    } catch (err) {
      console.error('useMerchants: Error creating merchant:', err);
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to create merchant",
          variant: "destructive",
        });
      }
      throw err;
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

  const deleteMerchant = async (merchantId: string) => {
    try {
      console.log('useMerchants: Deleting merchant:', merchantId);
      
      const { error } = await supabase
        .from('merchant_profiles')
        .delete()
        .eq('id', merchantId);

      if (error) throw error;

      if (isMountedRef.current) {
        setMerchants(prev => prev.filter(merchant => merchant.id !== merchantId));

        toast({
          title: "Success",
          description: "Merchant deleted successfully",
        });
      }
    } catch (err) {
      console.error('useMerchants: Error deleting merchant:', err);
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to delete merchant",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    
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
    createMerchant,
    updateMerchant,
    deleteMerchant
  };
};
