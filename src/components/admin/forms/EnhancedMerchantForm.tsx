
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Building2, User, Phone, Mail, MapPin, CreditCard } from "lucide-react";
import { merchantSchema, MerchantFormData } from './MerchantFormValidation';

interface EnhancedMerchantFormProps {
  initialData?: Partial<MerchantFormData>;
  onSubmit: (data: MerchantFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const EnhancedMerchantForm: React.FC<EnhancedMerchantFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<MerchantFormData>({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      business_name: initialData?.business_name || '',
      business_phone: initialData?.business_phone || '',
      full_name: initialData?.full_name || '',
      contact_number: initialData?.contact_number || '',
      email: initialData?.email || '',
      business_address: {
        street: initialData?.business_address?.street || '',
        city: initialData?.business_address?.city || '',
        state: initialData?.business_address?.state || '',
        pincode: initialData?.business_address?.pincode || ''
      },
      communication_address: {
        street: initialData?.communication_address?.street || '',
        city: initialData?.communication_address?.city || '',
        state: initialData?.communication_address?.state || '',
        pincode: initialData?.communication_address?.pincode || ''
      },
      incharge_name: initialData?.incharge_name || '',
      incharge_designation: initialData?.incharge_designation || '',
      incharge_phone: initialData?.incharge_phone || '',
      incharge_email: initialData?.incharge_email || '',
      bank_account_details: {
        account_number: initialData?.bank_account_details?.account_number || '',
        ifsc_code: initialData?.bank_account_details?.ifsc_code || '',
        bank_name: initialData?.bank_account_details?.bank_name || '',
        account_holder_name: initialData?.bank_account_details?.account_holder_name || ''
      },
      approval_status: initialData?.approval_status || 'pending',
      verification_status: initialData?.verification_status || 'unverified',
      notes: initialData?.notes || ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                {...register('business_name')}
                className={errors.business_name ? 'border-red-500' : ''}
              />
              {errors.business_name && (
                <p className="text-red-500 text-sm mt-1">{errors.business_name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="business_phone">Business Phone *</Label>
              <Input
                id="business_phone"
                {...register('business_phone')}
                className={errors.business_phone ? 'border-red-500' : ''}
              />
              {errors.business_phone && (
                <p className="text-red-500 text-sm mt-1">{errors.business_phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Business Address *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Input
                placeholder="Street Address"
                {...register('business_address.street')}
                className={errors.business_address?.street ? 'border-red-500' : ''}
              />
              <Input
                placeholder="City"
                {...register('business_address.city')}
                className={errors.business_address?.city ? 'border-red-500' : ''}
              />
              <Input
                placeholder="State"
                {...register('business_address.state')}
                className={errors.business_address?.state ? 'border-red-500' : ''}
              />
              <Input
                placeholder="Pincode"
                {...register('business_address.pincode')}
                className={errors.business_address?.pincode ? 'border-red-500' : ''}
              />
            </div>
            {errors.business_address && (
              <p className="text-red-500 text-sm mt-1">All address fields are required</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Owner Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Owner Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                {...register('full_name')}
                className={errors.full_name ? 'border-red-500' : ''}
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="contact_number">Contact Number *</Label>
              <Input
                id="contact_number"
                {...register('contact_number')}
                className={errors.contact_number ? 'border-red-500' : ''}
              />
              {errors.contact_number && (
                <p className="text-red-500 text-sm mt-1">{errors.contact_number.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Incharge Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Incharge Details (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="incharge_name">Incharge Name</Label>
              <Input id="incharge_name" {...register('incharge_name')} />
            </div>
            <div>
              <Label htmlFor="incharge_designation">Designation</Label>
              <Input id="incharge_designation" {...register('incharge_designation')} />
            </div>
            <div>
              <Label htmlFor="incharge_phone">Phone</Label>
              <Input id="incharge_phone" {...register('incharge_phone')} />
            </div>
            <div>
              <Label htmlFor="incharge_email">Email</Label>
              <Input 
                id="incharge_email" 
                type="email" 
                {...register('incharge_email')}
                className={errors.incharge_email ? 'border-red-500' : ''}
              />
              {errors.incharge_email && (
                <p className="text-red-500 text-sm mt-1">{errors.incharge_email.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status and Notes (Edit mode only) */}
      {mode === 'edit' && (
        <Card>
          <CardHeader>
            <CardTitle>Status & Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="approval_status">Approval Status</Label>
                <Select 
                  value={watch('approval_status')} 
                  onValueChange={(value) => setValue('approval_status', value as any)}
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
                  value={watch('verification_status')} 
                  onValueChange={(value) => setValue('verification_status', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unverified">Unverified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...register('notes')} rows={3} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Merchant' : 'Update Merchant'}
        </Button>
      </div>
    </form>
  );
};

export default EnhancedMerchantForm;
