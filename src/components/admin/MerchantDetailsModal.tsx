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
import { Building2, User, CreditCard, FileText, UserCheck, Phone, MapPin, Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
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
interface StudyHall {
  id: string;
  name: string;
  status: string;
  capacity: number;
  total_revenue: number;
  total_bookings: number;
  rating: number;
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
  incharge_name?: string;
  incharge_designation?: string;
  incharge_phone?: string;
  incharge_email?: string;
  incharge_address?: AddressData;
  approval_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  notes?: string;
  email?: string;
  created_at: string;
  updated_at: string;
  study_halls?: StudyHall[];
}
interface MerchantFormData {
  email: string;
  password: string;
  confirmPassword: string;
  business_name: string;
  business_phone: string;
  full_name: string;
  contact_number: string;
  business_address: AddressData;
  communication_address: AddressData;
  bank_account_details: BankAccountData;
  incharge_name: string;
  incharge_designation: string;
  incharge_phone: string;
  incharge_email: string;
  incharge_address: AddressData;
  refundable_security_deposit: number;
  approval_status: 'pending' | 'approved' | 'rejected' | 'suspended';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [studyHalls, setStudyHalls] = useState<StudyHall[]>([]);
  const {
    toast
  } = useToast();
  const form = useForm<MerchantFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
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
      incharge_name: '',
      incharge_designation: '',
      incharge_phone: '',
      incharge_email: '',
      incharge_address: {
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India'
      },
      refundable_security_deposit: 0,
      approval_status: 'pending' as const,
      notes: ''
    }
  });
  useEffect(() => {
    if (isOpen && merchantId && mode !== 'create') {
      fetchMerchantDetails();
      fetchStudyHalls();
    } else if (mode === 'create') {
      form.reset();
      setMerchant(null);
      setStudyHalls([]);
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
  const fetchStudyHalls = async () => {
    if (!merchantId) return;
    try {
      const {
        data,
        error
      } = await supabase.from('study_halls').select('*').eq('merchant_id', merchantId);
      if (error) throw error;
      setStudyHalls(data || []);
    } catch (error) {
      console.error('Error fetching study halls:', error);
    }
  };
  const fetchMerchantDetails = async () => {
    if (!merchantId) return;
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from('merchant_profiles').select('*').eq('id', merchantId).single();
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
        incharge_address: safeParseJson(data.incharge_address, {
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'India'
        }),
        approval_status: (data.approval_status || 'pending') as 'pending' | 'approved' | 'rejected' | 'suspended',
        slide_images: data.slide_images || []
      };
      setMerchant(merchantData);

      // Reset form with proper type casting
      const formData: MerchantFormData = {
        email: merchantData.email || '',
        password: '',
        // Never populate password field
        confirmPassword: '',
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
        incharge_name: merchantData.incharge_name || '',
        incharge_designation: merchantData.incharge_designation || '',
        incharge_phone: merchantData.incharge_phone || '',
        incharge_email: merchantData.incharge_email || '',
        incharge_address: merchantData.incharge_address || {
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'India'
        },
        refundable_security_deposit: merchantData.refundable_security_deposit || 0,
        approval_status: merchantData.approval_status,
        notes: merchantData.notes || ''
      };
      form.reset(formData);
    } catch (error) {
      console.error('Error fetching merchant details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch merchant details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const validateForm = (data: MerchantFormData): string | null => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return "Please enter a valid email address";
    }

    // Password validation for create mode
    if (mode === 'create') {
      if (!data.password || data.password.length < 6) {
        return "Password must be at least 6 characters long";
      }
      if (data.password !== data.confirmPassword) {
        return "Passwords do not match";
      }
    }

    // Password validation for edit mode (only if password is provided)
    if (mode === 'edit' && data.password) {
      if (data.password.length < 6) {
        return "Password must be at least 6 characters long";
      }
      if (data.password !== data.confirmPassword) {
        return "Passwords do not match";
      }
    }

    // Required field validation
    if (!data.business_name.trim()) {
      return "Business name is required";
    }
    if (!data.business_phone.trim()) {
      return "Business phone is required";
    }
    if (!data.full_name.trim()) {
      return "Full name is required";
    }
    if (!data.contact_number.trim()) {
      return "Contact number is required";
    }
    return null;
  };
  const onSubmit = async (data: MerchantFormData) => {
    const validationError = validateForm(data);
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      if (mode === 'create') {
        // Use the new authentication function for creating merchants
        const {
          data: result,
          error
        } = await supabase.rpc('create_merchant_with_auth', {
          p_email: data.email,
          p_password: data.password,
          p_business_name: data.business_name,
          p_business_phone: data.business_phone,
          p_full_name: data.full_name,
          p_contact_number: data.contact_number,
          p_business_address: data.business_address as unknown as Json,
          p_communication_address: data.communication_address as unknown as Json,
          p_bank_account_details: data.bank_account_details as unknown as Json,
          p_incharge_name: data.incharge_name,
          p_incharge_designation: data.incharge_designation,
          p_incharge_phone: data.incharge_phone,
          p_incharge_email: data.incharge_email,
          p_incharge_address: data.incharge_address as unknown as Json,
          p_refundable_security_deposit: data.refundable_security_deposit,
          p_approval_status: data.approval_status,
          p_notes: data.notes
        });
        if (error) throw error;

        // Update the email in merchant_profiles
        const {
          error: updateError
        } = await supabase.from('merchant_profiles').update({
          email: data.email
        }).eq('id', result);
        if (updateError) throw updateError;
        toast({
          title: "Success",
          description: "Merchant account created successfully with login credentials"
        });
      } else {
        // Convert form data to Supabase-compatible format for updates
        const supabaseData = {
          business_name: data.business_name,
          business_phone: data.business_phone,
          full_name: data.full_name,
          contact_number: data.contact_number,
          business_address: data.business_address as unknown as Json,
          communication_address: data.communication_address as unknown as Json,
          bank_account_details: data.bank_account_details as unknown as Json,
          incharge_name: data.incharge_name,
          incharge_designation: data.incharge_designation,
          incharge_phone: data.incharge_phone,
          incharge_email: data.incharge_email,
          incharge_address: data.incharge_address as unknown as Json,
          refundable_security_deposit: data.refundable_security_deposit,
          approval_status: data.approval_status,
          notes: data.notes,
          email: data.email
        };
        const {
          error
        } = await supabase.from('merchant_profiles').update(supabaseData).eq('id', merchantId);
        if (error) throw error;

        // Update password if provided
        if (data.password && merchant?.user_id) {
          const {
            error: passwordError
          } = await supabase.auth.admin.updateUserById(merchant.user_id, {
            password: data.password
          });
          if (passwordError) {
            console.warn('Password update failed:', passwordError);
            toast({
              title: "Warning",
              description: "Merchant profile updated but password change failed",
              variant: "destructive"
            });
          }
        }
        toast({
          title: "Success",
          description: "Merchant profile updated successfully"
        });
      }
      onMerchantUpdated();
      onClose();
    } catch (error) {
      console.error('Error saving merchant:', error);
      toast({
        title: "Error",
        description: "Failed to save merchant profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800'
    };
    return <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>;
  };
  const isViewMode = mode === 'view';
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            {mode === 'create' ? 'Add New Merchant' : mode === 'edit' ? 'Edit Merchant Profile' : 'Merchant Details'}
            {merchant && isViewMode && <div className="ml-auto">
                {getStatusBadge(merchant.approval_status)}
              </div>}
          </DialogTitle>
        </DialogHeader>

        {loading ? <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div> : <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="credentials" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="credentials">Login & Auth</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="incharge">Incharge information</TabsTrigger>
                  <TabsTrigger value="study-halls">Study Halls</TabsTrigger>
                  <TabsTrigger value="financial">Financial & Status</TabsTrigger>
                </TabsList>

                <TabsContent value="credentials" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Login Credentials
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <FormField control={form.control} name="email" render={({
                      field
                    }) => <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Address *
                              </FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="merchant@example.com" disabled={isViewMode} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="password" render={({
                        field
                      }) => <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Lock className="h-4 w-4" />
                                  {mode === 'create' ? 'Password *' : 'New Password (optional)'}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input {...field} type={showPassword ? "text" : "password"} placeholder={mode === 'create' ? "Enter secure password" : "Leave blank to keep current"} disabled={isViewMode} />
                                    {!isViewMode && <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                      </Button>}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="confirmPassword" render={({
                        field
                      }) => <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Lock className="h-4 w-4" />
                                  {mode === 'create' ? 'Confirm Password *' : 'Confirm New Password'}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input {...field} type={showConfirmPassword ? "text" : "password"} placeholder={mode === 'create' ? "Confirm password" : "Confirm new password"} disabled={isViewMode} />
                                    {!isViewMode && <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                      </Button>}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                        </div>

                        {mode === 'edit' && <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Note:</strong> Password fields are optional when editing. Leave blank to keep the current password unchanged.
                            </p>
                          </div>}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

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
                        <FormField control={form.control} name="business_name" render={({
                      field
                    }) => <FormItem>
                              <FormLabel>Business Name *</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isViewMode} placeholder="Enter business name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={form.control} name="business_phone" render={({
                      field
                    }) => <FormItem>
                              <FormLabel>Business Phone *</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isViewMode} placeholder="Enter business phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Business Address *
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="business_address.street" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="Street Address" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="business_address.city" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="City" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="business_address.state" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="State" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="business_address.postal_code" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="Postal Code" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
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
                        Owner Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="full_name" render={({
                      field
                    }) => <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isViewMode} placeholder="Enter full name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={form.control} name="contact_number" render={({
                      field
                    }) => <FormItem>
                              <FormLabel>Contact Number *</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isViewMode} placeholder="Enter contact number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>

                      <div className="space-y-2">
                        <Label>Communication Address</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="communication_address.street" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="Street Address" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="communication_address.city" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="City" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="communication_address.state" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="State" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="communication_address.postal_code" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="Postal Code" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="incharge" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Contact Person Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="incharge_name" render={({
                      field
                    }) => <FormItem>
                              <FormLabel>Contact Person Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Name of person in charge" {...field} disabled={isViewMode} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={form.control} name="incharge_designation" render={({
                      field
                    }) => <FormItem>
                              <FormLabel>Designation</FormLabel>
                              <FormControl>
                                <Input placeholder="Manager, Supervisor, etc." {...field} disabled={isViewMode} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={form.control} name="incharge_phone" render={({
                      field
                    }) => <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Contact number" {...field} disabled={isViewMode} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={form.control} name="incharge_email" render={({
                      field
                    }) => <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Email address" type="email" {...field} disabled={isViewMode} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Contact Person Address
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="incharge_address.street" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="Street Address" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="incharge_address.city" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="City" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="incharge_address.state" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="State" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="incharge_address.postal_code" render={({
                        field
                      }) => <FormItem>
                                <FormControl>
                                  <Input placeholder="Postal Code" {...field} disabled={isViewMode} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="study-halls" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Associated Study Halls ({studyHalls.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {studyHalls.length > 0 ? <div className="space-y-4">
                          {studyHalls.map(hall => <div key={hall.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg">{hall.name}</h4>
                                  <div className="flex items-center gap-4 mt-2">
                                    <Badge variant={hall.status === 'active' ? 'default' : 'secondary'}>
                                      {hall.status}
                                    </Badge>
                                    <span className="text-sm text-gray-600">
                                      Capacity: {hall.capacity}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      Rating: {hall.rating}/5
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-semibold text-emerald-600">
                                    ₹{hall.total_revenue.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {hall.total_bookings} bookings
                                  </div>
                                </div>
                              </div>
                            </div>)}
                        </div> : <div className="text-center py-8">
                          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No study halls associated with this merchant</p>
                          <p className="text-sm text-gray-400 mt-2">
                            Study halls will appear here once created
                          </p>
                        </div>}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Financial Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField control={form.control} name="refundable_security_deposit" render={({
                      field
                    }) => <FormItem>
                              <FormLabel>Security Deposit (₹)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} disabled={isViewMode} placeholder="Enter deposit amount" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />

                        <div className="space-y-2">
                          <Label>Bank Account Details</Label>
                          <div className="space-y-3">
                            <FormField control={form.control} name="bank_account_details.account_holder_name" render={({
                          field
                        }) => <FormItem>
                                  <FormControl>
                                    <Input placeholder="Account Holder Name" {...field} disabled={isViewMode} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>} />
                            <div className="grid grid-cols-2 gap-3">
                              <FormField control={form.control} name="bank_account_details.account_number" render={({
                            field
                          }) => <FormItem>
                                    <FormControl>
                                      <Input placeholder="Account Number" {...field} disabled={isViewMode} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>} />
                              <FormField control={form.control} name="bank_account_details.ifsc_code" render={({
                            field
                          }) => <FormItem>
                                    <FormControl>
                                      <Input placeholder="IFSC Code" {...field} disabled={isViewMode} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>} />
                            </div>
                            <FormField control={form.control} name="bank_account_details.bank_name" render={({
                          field
                        }) => <FormItem>
                                  <FormControl>
                                    <Input placeholder="Bank Name" {...field} disabled={isViewMode} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Status & Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField control={form.control} name="approval_status" render={({
                      field
                    }) => <FormItem>
                              <FormLabel>Approval Status</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange} disabled={isViewMode}>
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
                            </FormItem>} />

                        <FormField control={form.control} name="notes" render={({
                      field
                    }) => <FormItem>
                              <FormLabel>Admin Notes</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Internal notes about this merchant..." {...field} disabled={isViewMode} rows={6} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />

                        {!isViewMode && <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                              {loading ? 'Saving...' : mode === 'create' ? 'Create Merchant Account' : 'Update Merchant'}
                            </Button>
                          </div>}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>}
      </DialogContent>
    </Dialog>;
};
export default MerchantDetailsModal;