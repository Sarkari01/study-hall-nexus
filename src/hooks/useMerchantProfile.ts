
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface MerchantProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_phone: string;
  full_name: string;
  contact_number: string;
  business_address: any;
  approval_status: string;
  verification_status: string;
  onboarding_completed: boolean;
  email?: string;
  incharge_name?: string;
  incharge_designation?: string;
  incharge_phone?: string;
  incharge_email?: string;
  incharge_address?: any;
  communication_address?: any;
  bank_account_details?: any;
  total_study_halls?: number;
  total_revenue?: number;
  created_at: string;
  updated_at: string;
}

interface CreateMerchantProfileData {
  business_name: string;
  business_phone: string;
  full_name: string;
  contact_number: string;
  business_address: any;
  approval_status?: string;
  verification_status?: string;
  onboarding_completed?: boolean;
  email?: string;
  incharge_name?: string;
  incharge_designation?: string;
  incharge_phone?: string;
  incharge_email?: string;
  incharge_address?: any;
  communication_address?: any;
  bank_account_details?: any;
}

export const useMerchantProfile = () => {
  const { user } = useAuth();
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMerchantProfile = async () => {
    if (!user?.id) {
      console.log('useMerchantProfile: No user ID available');
      setLoading(false);
      return;
    }

    console.log('useMerchantProfile: Fetching merchant profile for user:', user.id);

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('useMerchantProfile: Error fetching merchant profile:', fetchError);
        setError(`Failed to load merchant profile: ${fetchError.message}`);
        return;
      }

      console.log('useMerchantProfile: Merchant profile data:', data);
      setMerchantProfile(data);
    } catch (err) {
      console.error('useMerchantProfile: Unexpected error:', err);
      setError('An unexpected error occurred while loading merchant profile');
    } finally {
      setLoading(false);
    }
  };

  const createMerchantProfile = async (profileData: CreateMerchantProfileData) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const insertData = {
        user_id: user.id,
        business_name: profileData.business_name,
        business_phone: profileData.business_phone,
        full_name: profileData.full_name,
        contact_number: profileData.contact_number,
        business_address: profileData.business_address || {},
        approval_status: profileData.approval_status || 'pending',
        verification_status: profileData.verification_status || 'unverified',
        onboarding_completed: profileData.onboarding_completed || false,
        email: profileData.email || user.email,
        incharge_name: profileData.incharge_name,
        incharge_designation: profileData.incharge_designation,
        incharge_phone: profileData.incharge_phone,
        incharge_email: profileData.incharge_email,
        incharge_address: profileData.incharge_address,
        communication_address: profileData.communication_address,
        bank_account_details: profileData.bank_account_details
      };

      const { data, error: createError } = await supabase
        .from('merchant_profiles')
        .insert(insertData)
        .select()
        .single();

      if (createError) {
        console.error('Error creating merchant profile:', createError);
        throw new Error('Failed to create merchant profile');
      }

      setMerchantProfile(data);
      toast({
        title: "Success",
        description: "Merchant profile created successfully",
      });

      return data;
    } catch (err) {
      console.error('Error creating merchant profile:', err);
      toast({
        title: "Error",
        description: "Failed to create merchant profile",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateMerchantProfile = async (updates: Partial<MerchantProfile>) => {
    if (!merchantProfile?.id) {
      throw new Error('No merchant profile to update');
    }

    try {
      const { data, error: updateError } = await supabase
        .from('merchant_profiles')
        .update(updates)
        .eq('id', merchantProfile.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating merchant profile:', updateError);
        throw new Error('Failed to update merchant profile');
      }

      setMerchantProfile(data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      return data;
    } catch (err) {
      console.error('Error updating merchant profile:', err);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    console.log('useMerchantProfile: useEffect triggered', { 
      user: !!user, 
      loading: loading 
    });
    
    if (user) {
      fetchMerchantProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    merchantProfile,
    loading,
    error,
    fetchMerchantProfile,
    createMerchantProfile,
    updateMerchantProfile,
    refetch: fetchMerchantProfile,
  };
};
