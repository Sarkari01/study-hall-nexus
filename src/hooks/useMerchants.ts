
import { useSecureData } from './useSecureData';
import { useMemo } from 'react';

interface Merchant {
  id: string;
  user_id?: string;
  business_name: string;
  business_phone: string;
  full_name: string;
  contact_number: string;
  email?: string;
  business_address: any;
  communication_address?: any;
  bank_account_details?: any;
  approval_status: 'pending' | 'approved' | 'rejected';
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  notes?: string;
  total_study_halls?: number;
  total_revenue?: number;
  created_at: string;
  updated_at: string;
  incharge_name?: string;
  incharge_designation?: string;
  incharge_phone?: string;
  incharge_email?: string;
  incharge_address?: any;
  onboarding_completed?: boolean;
}

const validateMerchantData = (data: any): boolean => {
  try {
    // Basic validation - check if required fields exist
    if (!data || typeof data !== 'object') {
      console.warn('useMerchants: Invalid merchant data: not an object');
      return false;
    }
    
    if (!data.business_name || !data.full_name || !data.business_phone) {
      console.warn('useMerchants: Invalid merchant data: missing required fields');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('useMerchants: Merchant validation error:', error);
    return false;
  }
};

export const useMerchants = () => {
  const secureDataHook = useSecureData<Merchant>({
    table: 'merchant_profiles',
    auditResource: 'merchant',
    requireAuth: true,
    validateData: validateMerchantData
  });

  console.log('useMerchants: Raw data from useSecureData:', secureDataHook.data?.length || 0);
  console.log('useMerchants: Loading state:', secureDataHook.loading);
  console.log('useMerchants: Error state:', secureDataHook.error);

  // Memoize merchants array to prevent unnecessary re-renders
  const merchants = useMemo(() => {
    return Array.isArray(secureDataHook.data) ? secureDataHook.data : [];
  }, [secureDataHook.data]);

  console.log('useMerchants: Final merchants count:', merchants.length);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    merchants: merchants,
    loading: secureDataHook.loading,
    error: secureDataHook.error,
    createMerchant: secureDataHook.create,
    fetchMerchants: secureDataHook.read,
    updateMerchant: secureDataHook.update,
    deleteMerchant: secureDataHook.delete,
    refreshMerchants: secureDataHook.refresh
  }), [
    merchants,
    secureDataHook.loading,
    secureDataHook.error,
    secureDataHook.create,
    secureDataHook.read,
    secureDataHook.update,
    secureDataHook.delete,
    secureDataHook.refresh
  ]);
};
