
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, User, CreditCard, FileText, Upload, X, Check, AlertCircle } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

interface AddressData {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface BankAccountData {
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  account_holder_name: string;
}

interface MerchantProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_phone: string;
  business_logo_url?: string;
  slide_images: string[];
  business_address: AddressData;
  trade_license_url?: string;
  refundable_security_deposit: number;
  aadhaar_card_url?: string;
  full_name: string;
  contact_number: string;
  communication_address?: AddressData;
  bank_account_details?: BankAccountData;
  approval_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verification_status: 'unverified' | 'pending' | 'verified';
  onboarding_completed: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface MerchantFormData {
  business_name: string;
  business_phone: string;
  full_name: string;
  contact_number: string;
  business_address: AddressData;
  communication_address: AddressData;
  bank_account_details: BankAccountData;
  refundable_security_deposit: number;
  approval_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verification_status: 'unverified' | 'pending' | 'verified';
  notes: string;
}

interface MerchantDetailsModalProps {
  merchantId?: string;
  isOpen: boolean;
  onClose: () => void;
  onMerchantUpdated: () => void;
  mode: 'view' | 'edit' | 'create';
}

const MerchantDetailsModal: React.FC<MerchantDetailsModalProps> = ({
  merchantId,
  isOpen,
  onClose,
  onMerchantUpdated,
  mode
}) => {
  const [loading, setLoading] = useState(false);
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const { toast } = useToast();
  
  const form = useForm<MerchantFormData>({
    defaultValues: {
      business_name: '',
      business_phone: '',
      full_name: '',
      contact_number: '',
      business_address: {
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India'
      },
      communication_address: {
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India'
      },
      bank_account_details: {
        account_number: '',
        ifsc_code: '',
        bank_name: '',
        account_holder_name: ''
      },
      refundable_security_deposit: 0,
      approval_status: 'pending',
      verification_status: 'unverified',
      notes: ''
    }
  });

  useEffect(() => {
    if (isOpen && merchantId && mode !== 'create') {
      fetchMerchantDetails();
    } else if (mode === 'create') {
      form.reset();
      setMerchant(null);
    }
  }, [isOpen, merchantId, mode]);

  const safeParseJson = (data: any, fallback: any) => {
    if (!data) return fallback;
    if (typeof data === 'object') return data;
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  };

  const fetchMerchantDetails = async () => {
    if (!merchantId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('id', merchantId)
        .single();

      if (error) throw error;

      // Parse and type-cast the data properly
      const merchantData: MerchantProfile = {
        ...data,
        business_address: safeParseJson(data.business_address, {
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'India'
        }),
        communication_address: safeParseJson(data.communication_address, {
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'India'
        }),
        bank_account_details: safeParseJson(data.bank_account_details, {
          account_number: '',
          ifsc_code: '',
          bank_name: '',
          account_holder_name: ''
        }),
        approval_status: (data.approval_status || 'pending') as 'pending' | 'approved' | 'rejected' | 'suspended',
        verification_status: (data.verification_status || 'unverified') as 'unverified' | 'pending' | 'verified',
        slide_images: data.slide_images || []
      };

      setMerchant(merchantData);
      
      // Reset form with proper type casting
      const formData: MerchantFormData = {
        business_name: merchantData.business_name || '',
        business_phone: merchantData.business_phone || '',
        full_name: merchantData.full_name || '',
        contact_number: merchantData.contact_number || '',
        business_address: merchantData.business_address,
        communication_address: merchantData.communication_address || {
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'India'
        },
        bank_account_details: merchantData.bank_account_details || {
          account_number: '',
          ifsc_code: '',
          bank_name: '',
          account_holder_name: ''
        },
        refundable_security_deposit: merchantData.refundable_security_deposit || 0,
        approval_status: merchantData.approval_status,
        verification_status: merchantData.verification_status,
        notes: merchantData.notes || ''
      };
      
      form.reset(formData);
    } catch (error) {
      console.error('Error fetching merchant details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch merchant details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: MerchantFormData) => {
    setLoading(true);
    try {
      // Convert form data to Supabase-compatible format
      const supabaseData = {
        business_name: data.business_name,
        business_phone: data.business_phone,
        full_name: data.full_name,
        contact_number: data.contact_number,
        business_address: data.business_address as Json,
        communication_address: data.communication_address as Json,
        bank_account_details: data.bank_account_details as Json,
        refundable_security_deposit: data.refundable_security_deposit,
        approval_status: data.approval_status,
        verification_status: data.verification_status,
        notes: data.notes
      };

      if (mode === 'create') {
        const { error } = await supabase
          .from('merchant_profiles')
          .insert(supabaseData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Merchant profile created successfully",
        });
      } else {
        const { error } = await supabase
          .from('merchant_profiles')
          .update(supabaseData)
          .eq('id', merchantId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Merchant profile updated successfully",
        });
      }

      onMerchantUpdated();
      onClose();
    } catch (error) {
      console.error('Error saving merchant:', error);
      toast({
        title: "Error",
        description: "Failed to save merchant profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, type: 'approval' | 'verification') => {
    const colors = {
      approval: {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        suspended: 'bg-gray-100 text-gray-800'
      },
      verification: {
        unverified: 'bg-gray-100 text-gray-800',
        pending: 'bg-yellow-100 text-yellow-800',
        verified: 'bg-green-100 text-green-800'
      }
    };

    return (
      <Badge className={colors[type][status as keyof typeof colors[typeof type]]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const isViewMode = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {mode === 'create' ? 'Add New Merchant' : 
             mode === 'edit' ? 'Edit Merchant Profile' : 'Merchant Details'}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="business" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="status">Status</TabsTrigger>
                </TabsList>

                <TabsContent value="business" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Business Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="business_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name *</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isViewMode} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="business_phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Phone *</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isViewMode} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Business Address *</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="business_address.street"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Street Address" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="business_address.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="City" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="business_address.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="State" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="business_address.postal_code"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Postal Code" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="personal" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isViewMode} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contact_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Number *</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isViewMode} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Communication Address</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="communication_address.street"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Street Address" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="communication_address.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="City" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="communication_address.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="State" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="communication_address.postal_code"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Postal Code" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Financial Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="refundable_security_deposit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Refundable Security Deposit (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                disabled={isViewMode} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <Label>Bank Account Details</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="bank_account_details.account_holder_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Account Holder Name" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="bank_account_details.account_number"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Account Number" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="bank_account_details.bank_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Bank Name" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="bank_account_details.ifsc_code"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="IFSC Code" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="status" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Status & Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {merchant && (
                        <div className="flex gap-4 mb-4">
                          <div>
                            <Label>Approval Status</Label>
                            {getStatusBadge(merchant.approval_status, 'approval')}
                          </div>
                          <div>
                            <Label>Verification Status</Label>
                            {getStatusBadge(merchant.verification_status, 'verification')}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="approval_status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Approval Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isViewMode}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                  <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="verification_status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Verification Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isViewMode}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="unverified">Unverified</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="verified">Verified</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea {...field} disabled={isViewMode} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                {!isViewMode && (
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : mode === 'create' ? 'Create Merchant' : 'Update Merchant'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MerchantDetailsModal;
