
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import EnhancedMerchantForm from './forms/EnhancedMerchantForm';
import type { MerchantFormData } from './forms/MerchantFormValidation';

interface EditMerchantModalProps {
  merchant: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (merchantId: string, updates: any) => void;
}

const EditMerchantModal: React.FC<EditMerchantModalProps> = ({
  merchant,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: MerchantFormData) => {
    if (!merchant?.id) return;

    setIsLoading(true);
    try {
      await onSubmit(merchant.id, data);
      onClose();
      toast({
        title: "Success",
        description: "Merchant updated successfully",
      });
    } catch (error) {
      console.error('Error updating merchant:', error);
      toast({
        title: "Error",
        description: "Failed to update merchant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!merchant) return null;

  // Prepare initial data for the form
  const initialData = {
    business_name: merchant.business_name || '',
    business_phone: merchant.business_phone || '',
    full_name: merchant.full_name || '',
    contact_number: merchant.contact_number || '',
    email: merchant.email || '',
    business_address: typeof merchant.business_address === 'string' 
      ? JSON.parse(merchant.business_address) 
      : merchant.business_address || {},
    communication_address: typeof merchant.communication_address === 'string'
      ? JSON.parse(merchant.communication_address)
      : merchant.communication_address || {},
    incharge_name: merchant.incharge_name || '',
    incharge_designation: merchant.incharge_designation || '',
    incharge_phone: merchant.incharge_phone || '',
    incharge_email: merchant.incharge_email || '',
    incharge_address: typeof merchant.incharge_address === 'string'
      ? JSON.parse(merchant.incharge_address)
      : merchant.incharge_address || {},
    bank_account_details: typeof merchant.bank_account_details === 'string'
      ? JSON.parse(merchant.bank_account_details)
      : merchant.bank_account_details || {},
    approval_status: merchant.approval_status || 'pending',
    verification_status: merchant.verification_status || 'unverified',
    notes: merchant.notes || ''
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Merchant: {merchant.business_name}</DialogTitle>
        </DialogHeader>

        <EnhancedMerchantForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditMerchantModal;
