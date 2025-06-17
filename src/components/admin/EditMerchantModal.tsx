
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Merchant {
  id: string;
  full_name: string;
  business_name: string;
  business_phone: string;
  contact_number: string;
  email?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  verification_status: 'unverified' | 'verified' | 'rejected';
  business_address: any;
  communication_address?: any;
  bank_account_details?: any;
  incharge_name?: string;
  incharge_designation?: string;
  incharge_phone?: string;
  incharge_email?: string;
  incharge_address?: any;
  refundable_security_deposit?: number;
  notes?: string;
}

interface EditMerchantModalProps {
  merchant: Merchant | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (merchantId: string, updates: Partial<Merchant>) => Promise<void>;
}

const EditMerchantModal: React.FC<EditMerchantModalProps> = ({
  merchant,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (merchant) {
      setFormData({
        full_name: merchant.full_name || '',
        business_name: merchant.business_name || '',
        business_phone: merchant.business_phone || '',
        contact_number: merchant.contact_number || '',
        email: merchant.email || '',
        approval_status: merchant.approval_status || 'pending',
        verification_status: merchant.verification_status || 'unverified',
        business_address: merchant.business_address || { street: '', city: '', state: '', pincode: '', country: 'India' },
        communication_address: merchant.communication_address || { street: '', city: '', state: '', pincode: '', country: 'India' },
        bank_account_details: merchant.bank_account_details || { account_holder_name: '', account_number: '', ifsc_code: '', bank_name: '', branch_name: '' },
        incharge_name: merchant.incharge_name || '',
        incharge_designation: merchant.incharge_designation || '',
        incharge_phone: merchant.incharge_phone || '',
        incharge_email: merchant.incharge_email || '',
        refundable_security_deposit: merchant.refundable_security_deposit || 0,
        notes: merchant.notes || ''
      });
    }
  }, [merchant]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant) return;

    setLoading(true);
    try {
      await onSubmit(merchant.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating merchant:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!merchant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Merchant: {merchant.business_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_full_name">Full Name *</Label>
                <Input
                  id="edit_full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_business_name">Business Name *</Label>
                <Input
                  id="edit_business_name"
                  value={formData.business_name || ''}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit_business_phone">Business Phone *</Label>
                <Input
                  id="edit_business_phone"
                  value={formData.business_phone || ''}
                  onChange={(e) => handleInputChange('business_phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_contact_number">Contact Number *</Label>
                <Input
                  id="edit_contact_number"
                  value={formData.contact_number || ''}
                  onChange={(e) => handleInputChange('contact_number', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_approval_status">Approval Status</Label>
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
                <Label htmlFor="edit_business_street">Street Address</Label>
                <Input
                  id="edit_business_street"
                  value={formData.business_address?.street || ''}
                  onChange={(e) => handleInputChange('business_address.street', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit_business_city">City</Label>
                <Input
                  id="edit_business_city"
                  value={formData.business_address?.city || ''}
                  onChange={(e) => handleInputChange('business_address.city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit_business_state">State</Label>
                <Input
                  id="edit_business_state"
                  value={formData.business_address?.state || ''}
                  onChange={(e) => handleInputChange('business_address.state', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit_business_pincode">Pincode</Label>
                <Input
                  id="edit_business_pincode"
                  value={formData.business_address?.pincode || ''}
                  onChange={(e) => handleInputChange('business_address.pincode', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit_business_country">Country</Label>
                <Input
                  id="edit_business_country"
                  value={formData.business_address?.country || ''}
                  onChange={(e) => handleInputChange('business_address.country', e.target.value)}
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
                <Label htmlFor="edit_incharge_name">Name</Label>
                <Input
                  id="edit_incharge_name"
                  value={formData.incharge_name || ''}
                  onChange={(e) => handleInputChange('incharge_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit_incharge_designation">Designation</Label>
                <Input
                  id="edit_incharge_designation"
                  value={formData.incharge_designation || ''}
                  onChange={(e) => handleInputChange('incharge_designation', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit_incharge_phone">Phone</Label>
                <Input
                  id="edit_incharge_phone"
                  value={formData.incharge_phone || ''}
                  onChange={(e) => handleInputChange('incharge_phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit_incharge_email">Email</Label>
                <Input
                  id="edit_incharge_email"
                  type="email"
                  value={formData.incharge_email || ''}
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
                <Label htmlFor="edit_refundable_security_deposit">Refundable Security Deposit (₹)</Label>
                <Input
                  id="edit_refundable_security_deposit"
                  type="number"
                  value={formData.refundable_security_deposit || 0}
                  onChange={(e) => handleInputChange('refundable_security_deposit', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="edit_notes">Notes</Label>
                <Textarea
                  id="edit_notes"
                  value={formData.notes || ''}
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
              {loading ? 'Updating...' : 'Update Merchant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMerchantModal;
