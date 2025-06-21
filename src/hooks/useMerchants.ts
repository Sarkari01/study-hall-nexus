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
      console.warn('useMerchants: Invalid merchant data: not an object', data);
      return false;
    }
    
    // Check required business fields
    if (!data.business_name || typeof data.business_name !== 'string' || data.business_name.trim() === '') {
      console.warn('useMerchants: Invalid merchant data: missing or invalid business_name', data);
      return false;
    }
    
    if (!data.full_name || typeof data.full_name !== 'string' || data.full_name.trim() === '') {
      console.warn('useMerchants: Invalid merchant data: missing or invalid full_name', data);
      return false;
    }
    
    if (!data.business_phone || typeof data.business_phone !== 'string' || data.business_phone.trim() === '') {
      console.warn('useMerchants: Invalid merchant data: missing or invalid business_phone', data);
      return false;
    }

    // user_id is optional - some merchants may not have associated auth users
    if (data.user_id && typeof data.user_id !== 'string') {
      console.warn('useMerchants: Invalid merchant data: invalid user_id format', data);
      return false;
    }

    // Validate status fields if present
    const validApprovalStatuses = ['pending', 'approved', 'rejected'];
    if (data.approval_status && !validApprovalStatuses.includes(data.approval_status)) {
      console.warn('useMerchants: Invalid merchant data: invalid approval_status', data);
      return false;
    }

    const validVerificationStatuses = ['unverified', 'pending', 'verified', 'rejected'];
    if (data.verification_status && !validVerificationStatuses.includes(data.verification_status)) {
      console.warn('useMerchants: Invalid merchant data: invalid verification_status', data);
      return false;
    }
    
    console.log('useMerchants: Merchant data validation passed for:', data.business_name);
    return true;
  } catch (error) {
    console.error('useMerchants: Merchant validation error:', error, data);
    return false;
  }
};

export const useMerchants = () => {
  const secureDataHook = useSecureData<Merchant>({
    table: 'merchant_profiles',
    requireAuth: true,
    validateData: validateMerchantData,
    logAccess: true
  });

  console.log('useMerchants: Raw data from useSecureData:', secureDataHook.data?.length || 0);
  console.log('useMerchants: Loading state:', secureDataHook.loading);
  console.log('useMerchants: Error state:', secureDataHook.error);

  // Memoize merchants array to prevent unnecessary re-renders
  const merchants = useMemo(() => {
    if (!Array.isArray(secureDataHook.data)) {
      console.log('useMerchants: Data is not an array:', typeof secureDataHook.data);
      return [];
    }
    
    console.log('useMerchants: Processing merchants array of length:', secureDataHook.data.length);
    
    // Sort merchants by creation date (newest first) and ensure consistent ordering
    const sortedMerchants = [...secureDataHook.data].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
    
    return sortedMerchants;
  }, [secureDataHook.data]);

  console.log('useMerchants: Final merchants count:', merchants.length);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    merchants: merchants,
    loading: secureDataHook.loading,
    error: secureDataHook.error,
    refreshMerchants: secureDataHook.refetch
  }), [
    merchants,
    secureDataHook.loading,
    secureDataHook.error,
    secureDataHook.refetch
  ]);
};
