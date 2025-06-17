
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [formData, setFormData] = useState({
    business_name: '',
    business_phone: '',
    full_name: '',
    contact_number: '',
    email: '',
    business_address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    approval_status: 'pending',
    verification_status: 'unverified',
    notes: ''
  });

  useEffect(() => {
    if (merchant) {
      const address = typeof merchant.business_address === 'string' 
        ? JSON.parse(merchant.business_address) 
        : merchant.business_address || {};
        
      setFormData({
        business_name: merchant.business_name || '',
        business_phone: merchant.business_phone || '',
        full_name: merchant.full_name || '',
        contact_number: merchant.contact_number || '',
        email: merchant.email || '',
        business_address: {
          street: address.street || '',
          city: address.city || '',
          state: address.state || '',
          pincode: address.pincode || ''
        },
        approval_status: merchant.approval_status || 'pending',
        verification_status: merchant.verification_status || 'unverified',
        notes: merchant.notes || ''
      });
    }
  }, [merchant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(merchant.id, formData);
    onClose();
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      business_address: {
        ...prev.business_address,
        [field]: value
      }
    }));
  };

  if (!merchant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Merchant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="business_phone">Business Phone *</Label>
              <Input
                id="business_phone"
                value={formData.business_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, business_phone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Owner Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact_number">Contact Number *</Label>
              <Input
                id="contact_number"
                value={formData.contact_number}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_number: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Business Address *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="Street"
                value={formData.business_address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                required
              />
              <Input
                placeholder="City"
                value={formData.business_address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                required
              />
              <Input
                placeholder="State"
                value={formData.business_address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                required
              />
              <Input
                placeholder="Pincode"
                value={formData.business_address.pincode}
                onChange={(e) => handleAddressChange('pincode', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="approval_status">Approval Status</Label>
              <Select
                value={formData.approval_status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, approval_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="verification_status">Verification Status</Label>
              <Select
                value={formData.verification_status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, verification_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Merchant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMerchantModal;
