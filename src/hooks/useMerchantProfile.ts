
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

export const useMerchantProfile = () => {
  const { user, userProfile } = useAuth();
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMerchantProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching merchant profile:', fetchError);
        setError('Failed to load merchant profile');
        return;
      }

      setMerchantProfile(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createMerchantProfile = async (profileData: Partial<MerchantProfile>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error: createError } = await supabase
        .from('merchant_profiles')
        .insert({
          user_id: user.id,
          ...profileData,
          email: user.email
        })
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
    if (user && userProfile?.role === 'merchant') {
      fetchMerchantProfile();
    } else {
      setLoading(false);
    }
  }, [user, userProfile]);

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
