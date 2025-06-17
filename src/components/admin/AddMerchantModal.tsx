
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (merchantData: any) => Promise<void>;
}

const AddMerchantModal: React.FC<AddMerchantModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    business_phone: '',
    contact_number: '',
    email: '',
    approval_status: 'pending' as 'pending' | 'approved' | 'rejected',
    business_address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    communication_address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    bank_account_details: {
      account_holder_name: '',
      account_number: '',
      ifsc_code: '',
      bank_name: '',
      branch_name: ''
    },
    incharge_name: '',
    incharge_designation: '',
    incharge_phone: '',
    incharge_email: '',
    incharge_address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    refundable_security_deposit: 0,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [sameAsBusinessAddress, setSameAsBusinessAddress] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSameAddressChange = (checked: boolean) => {
    setSameAsBusinessAddress(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        communication_address: { ...prev.business_address }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      setFormData({
        full_name: '',
        business_name: '',
        business_phone: '',
        contact_number: '',
        email: '',
        approval_status: 'pending',
        business_address: { street: '', city: '', state: '', pincode: '', country: 'India' },
        communication_address: { street: '', city: '', state: '', pincode: '', country: 'India' },
        bank_account_details: { account_holder_name: '', account_number: '', ifsc_code: '', bank_name: '', branch_name: '' },
        incharge_name: '',
        incharge_designation: '',
        incharge_phone: '',
        incharge_email: '',
        incharge_address: { street: '', city: '', state: '', pincode: '', country: 'India' },
        refundable_security_deposit: 0,
        notes: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating merchant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Merchant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  value={formData.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="business_phone">Business Phone *</Label>
                <Input
                  id="business_phone"
                  value={formData.business_phone}
                  onChange={(e) => handleInputChange('business_phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_number">Contact Number *</Label>
                <Input
                  id="contact_number"
                  value={formData.contact_number}
                  onChange={(e) => handleInputChange('contact_number', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="approval_status">Approval Status</Label>
                <Select value={formData.approval_status} onValueChange={(value) => handleInputChange('approval_status', value)}>
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
            </CardContent>
          </Card>

          {/* Business Address */}
          <Card>
            <CardHeader>
              <CardTitle>Business Address</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="business_street">Street Address</Label>
                <Input
                  id="business_street"
                  value={formData.business_address.street}
                  onChange={(e) => handleInputChange('business_address.street', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business_city">City</Label>
                <Input
                  id="business_city"
                  value={formData.business_address.city}
                  onChange={(e) => handleInputChange('business_address.city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business_state">State</Label>
                <Input
                  id="business_state"
                  value={formData.business_address.state}
                  onChange={(e) => handleInputChange('business_address.state', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business_pincode">Pincode</Label>
                <Input
                  id="business_pincode"
                  value={formData.business_address.pincode}
                  onChange={(e) => handleInputChange('business_address.pincode', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business_country">Country</Label>
                <Input
                  id="business_country"
                  value={formData.business_address.country}
                  onChange={(e) => handleInputChange('business_address.country', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Communication Address */}
          <Card>
            <CardHeader>
              <CardTitle>Communication Address</CardTitle>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="same_address"
                  checked={sameAsBusinessAddress}
                  onChange={(e) => handleSameAddressChange(e.target.checked)}
                />
                <Label htmlFor="same_address">Same as Business Address</Label>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="comm_street">Street Address</Label>
                <Input
                  id="comm_street"
                  value={formData.communication_address.street}
                  onChange={(e) => handleInputChange('communication_address.street', e.target.value)}
                  disabled={sameAsBusinessAddress}
                />
              </div>
              <div>
                <Label htmlFor="comm_city">City</Label>
                <Input
                  id="comm_city"
                  value={formData.communication_address.city}
                  onChange={(e) => handleInputChange('communication_address.city', e.target.value)}
                  disabled={sameAsBusinessAddress}
                />
              </div>
              <div>
                <Label htmlFor="comm_state">State</Label>
                <Input
                  id="comm_state"
                  value={formData.communication_address.state}
                  onChange={(e) => handleInputChange('communication_address.state', e.target.value)}
                  disabled={sameAsBusinessAddress}
                />
              </div>
              <div>
                <Label htmlFor="comm_pincode">Pincode</Label>
                <Input
                  id="comm_pincode"
                  value={formData.communication_address.pincode}
                  onChange={(e) => handleInputChange('communication_address.pincode', e.target.value)}
                  disabled={sameAsBusinessAddress}
                />
              </div>
              <div>
                <Label htmlFor="comm_country">Country</Label>
                <Input
                  id="comm_country"
                  value={formData.communication_address.country}
                  onChange={(e) => handleInputChange('communication_address.country', e.target.value)}
                  disabled={sameAsBusinessAddress}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle>Bank Account Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="account_holder_name">Account Holder Name</Label>
                <Input
                  id="account_holder_name"
                  value={formData.bank_account_details.account_holder_name}
                  onChange={(e) => handleInputChange('bank_account_details.account_holder_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  value={formData.bank_account_details.account_number}
                  onChange={(e) => handleInputChange('bank_account_details.account_number', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ifsc_code">IFSC Code</Label>
                <Input
                  id="ifsc_code"
                  value={formData.bank_account_details.ifsc_code}
                  onChange={(e) => handleInputChange('bank_account_details.ifsc_code', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  value={formData.bank_account_details.bank_name}
                  onChange={(e) => handleInputChange('bank_account_details.bank_name', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="branch_name">Branch Name</Label>
                <Input
                  id="branch_name"
                  value={formData.bank_account_details.branch_name}
                  onChange={(e) => handleInputChange('bank_account_details.branch_name', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Point of Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Point of Contact (In-charge)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incharge_name">Name</Label>
                <Input
                  id="incharge_name"
                  value={formData.incharge_name}
                  onChange={(e) => handleInputChange('incharge_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="incharge_designation">Designation</Label>
                <Input
                  id="incharge_designation"
                  value={formData.incharge_designation}
                  onChange={(e) => handleInputChange('incharge_designation', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="incharge_phone">Phone</Label>
                <Input
                  id="incharge_phone"
                  value={formData.incharge_phone}
                  onChange={(e) => handleInputChange('incharge_phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="incharge_email">Email</Label>
                <Input
                  id="incharge_email"
                  type="email"
                  value={formData.incharge_email}
                  onChange={(e) => handleInputChange('incharge_email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="refundable_security_deposit">Refundable Security Deposit (₹)</Label>
                <Input
                  id="refundable_security_deposit"
                  type="number"
                  value={formData.refundable_security_deposit}
                  onChange={(e) => handleInputChange('refundable_security_deposit', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Merchant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMerchantModal;
