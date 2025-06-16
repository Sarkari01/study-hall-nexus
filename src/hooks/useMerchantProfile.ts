
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
}

export const useMerchantProfile = () => {
  // Mock user data for development mode
  const mockUser = {
    id: 'demo-merchant-user-id',
    email: 'demo@merchant.com'
  };
  
  const mockUserProfile = {
    role: 'merchant'
  };

  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMerchantProfile = async () => {
    if (!mockUser?.id) {
      console.log('useMerchantProfile: No user ID available (development mode)');
      setLoading(false);
      return;
    }

    console.log('useMerchantProfile: Fetching merchant profile for user:', mockUser.id);
    console.log('useMerchantProfile: User profile role:', mockUserProfile?.role);

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('user_id', mockUser.id)
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
    if (!mockUser?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const insertData = {
        user_id: mockUser.id,
        business_name: profileData.business_name,
        business_phone: profileData.business_phone,
        full_name: profileData.full_name,
        contact_number: profileData.contact_number,
        business_address: profileData.business_address || {},
        approval_status: profileData.approval_status || 'pending',
        verification_status: profileData.verification_status || 'unverified',
        onboarding_completed: profileData.onboarding_completed || false,
        email: mockUser.email
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
      user: !!mockUser, 
      userProfileRole: mockUserProfile?.role,
      loading: loading 
    });
    
    // In development mode, just set loading to false and don't fetch from database
    // This prevents infinite loading when there's no real authentication
    if (mockUser && mockUserProfile?.role === 'merchant') {
      console.log('useMerchantProfile: Development mode - skipping database fetch');
      setLoading(false);
      setMerchantProfile(null); // Will be handled by the dashboard component
    } else if (mockUser && mockUserProfile && mockUserProfile.role !== 'merchant') {
      console.log('useMerchantProfile: User is not a merchant, role:', mockUserProfile.role);
      setError('Access denied: This account is not a merchant account');
      setLoading(false);
    } else {
      console.log('useMerchantProfile: No user available');
      setLoading(false);
    }
  }, []); // Empty dependency array to prevent re-runs

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
