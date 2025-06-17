
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (merchantData: any) => void;
}

const AddMerchantModal: React.FC<AddMerchantModalProps> = ({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Merchant</DialogTitle>
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
              Add Merchant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMerchantModal;
