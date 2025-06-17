
import { useSecureData } from './useSecureData';
import { validateMerchant } from '@/utils/dataValidation';

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
}

const validateMerchantData = (data: any): boolean => {
  const result = validateMerchant(data);
  return result.isValid;
};

export const useMerchants = () => {
  const secureDataHook = useSecureData<Merchant>({
    table: 'merchant_profiles',
    auditResource: 'merchant',
    requireAuth: true,
    validateData: validateMerchantData
  });

  return {
    merchants: secureDataHook.data,
    loading: secureDataHook.loading,
    error: secureDataHook.error,
    createMerchant: secureDataHook.create,
    fetchMerchants: secureDataHook.read,
    updateMerchant: secureDataHook.update,
    deleteMerchant: secureDataHook.delete,
    refreshMerchants: secureDataHook.refresh
  };
};
