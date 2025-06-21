import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Store, ArrowLeft, Building, Phone, Mail, User, MapPin } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

const MerchantSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    // Account details
    email: '',
    password: '',
    confirmPassword: '',
    
    // Business details
    businessName: '',
    businessPhone: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessPincode: '',
    
    // Personal details
    fullName: '',
    contactNumber: '',
    
    // Optional details
    communicationAddress: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all account details');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.businessName || !formData.businessPhone || !formData.businessAddress || 
        !formData.businessCity || !formData.businessState || !formData.businessPincode) {
      setError('Please fill in all required business details');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.fullName || !formData.contactNumber) {
      setError('Please fill in all personal details');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    setError('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSignup = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Starting merchant signup process...');
      
      // First, try to sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            business_name: formData.businessName
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        setError(`Failed to create account: ${authError.message}`);
        return;
      }

      if (!authData.user) {
        console.error('No user returned from signup');
        setError('Failed to create user account');
        return;
      }

      console.log('Auth user created:', authData.user.id);

      // Create the merchant profile
      const businessAddress = {
        street: formData.businessAddress,
        city: formData.businessCity,
        state: formData.businessState,
        postal_code: formData.businessPincode,
        country: 'India'
      };

      const communicationAddress = formData.communicationAddress ? {
        street: formData.communicationAddress,
        city: formData.businessCity,
        state: formData.businessState,
        postal_code: formData.businessPincode,
        country: 'India'
      } : null;

      console.log('Creating merchant profile...');

      const { data: merchantData, error: merchantError } = await supabase
        .from('merchant_profiles')
        .insert({
          user_id: authData.user.id,
          business_name: formData.businessName,
          business_phone: formData.businessPhone,
          full_name: formData.fullName,
          contact_number: formData.contactNumber,
          business_address: businessAddress,
          communication_address: communicationAddress,
          approval_status: 'pending',
          notes: formData.notes || null,
          email: formData.email.trim()
        })
        .select()
        .single();

      if (merchantError) {
        console.error('Merchant profile creation error:', merchantError);
        setError(`Failed to create merchant profile: ${merchantError.message}`);
        return;
      }

      console.log('Merchant profile created:', merchantData);

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          full_name: formData.fullName,
          role: 'merchant',
          merchant_id: merchantData.id
        });

      if (profileError) {
        console.error('User profile creation error:', profileError);
        setError(`Failed to create user profile: ${profileError.message}`);
        return;
      }

      console.log('User profile created successfully');

      toast({
        title: "Account Created Successfully!",
        description: "Your merchant account has been created and is pending approval. You'll receive an email once approved.",
      });

      // Sign out the user since they need approval first
      await supabase.auth.signOut();

      // Redirect to login page
      navigate('/merchant-login');

    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      setError(`An unexpected error occurred: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-blue-900">Account Information</h3>
        <p className="text-sm text-blue-600">Create your merchant account credentials</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-blue-800">Business Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your business email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-blue-800">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className="border-blue-200 focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-blue-800">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className="border-blue-200 focus:border-blue-500"
          disabled={loading}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-blue-900">Business Information</h3>
        <p className="text-sm text-blue-600">Tell us about your business</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessName" className="text-blue-800">Business Name *</Label>
        <div className="relative">
          <Building className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            id="businessName"
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessPhone" className="text-blue-800">Business Phone *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            id="businessPhone"
            placeholder="Enter business phone number"
            value={formData.businessPhone}
            onChange={(e) => handleInputChange('businessPhone', e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessAddress" className="text-blue-800">Business Address *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            id="businessAddress"
            placeholder="Street address"
            value={formData.businessAddress}
            onChange={(e) => handleInputChange('businessAddress', e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessCity" className="text-blue-800">City *</Label>
          <Input
            id="businessCity"
            placeholder="City"
            value={formData.businessCity}
            onChange={(e) => handleInputChange('businessCity', e.target.value)}
            className="border-blue-200 focus:border-blue-500"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessState" className="text-blue-800">State *</Label>
          <Input
            id="businessState"
            placeholder="State"
            value={formData.businessState}
            onChange={(e) => handleInputChange('businessState', e.target.value)}
            className="border-blue-200 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessPincode" className="text-blue-800">Pincode *</Label>
        <Input
          id="businessPincode"
          placeholder="Pincode"
          value={formData.businessPincode}
          onChange={(e) => handleInputChange('businessPincode', e.target.value)}
          className="border-blue-200 focus:border-blue-500"
          disabled={loading}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-blue-900">Personal Information</h3>
        <p className="text-sm text-blue-600">Your contact details</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-blue-800">Full Name *</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber" className="text-blue-800">Contact Number *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
          <Input
            id="contactNumber"
            placeholder="Enter your contact number"
            value={formData.contactNumber}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="communicationAddress" className="text-blue-800">Communication Address (Optional)</Label>
        <Textarea
          id="communicationAddress"
          placeholder="Enter communication address if different from business address"
          value={formData.communicationAddress}
          onChange={(e) => handleInputChange('communicationAddress', e.target.value)}
          className="border-blue-200 focus:border-blue-500"
          disabled={loading}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-blue-900">Additional Information</h3>
        <p className="text-sm text-blue-600">Any additional details (optional)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-blue-800">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional information you'd like to share"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className="border-blue-200 focus:border-blue-500"
          disabled={loading}
          rows={4}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Your account will be created and marked as "pending approval"</li>
          <li>• Our team will review your business information</li>
          <li>• You'll receive an email notification once approved</li>
          <li>• After approval, you can start adding study halls</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
              <Store className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Join as Merchant</h1>
              <p className="text-sm text-blue-700">Start your study hall business</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-3 h-3 rounded-full ${
                  stepNum <= step ? 'bg-blue-600' : 'bg-blue-200'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-blue-900">
              Step {step} of 4
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 mb-4">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={loading}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSignup}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              )}
            </div>

            <div className="mt-6 text-center">
              <Button 
                variant="link" 
                onClick={() => navigate('/merchant-login')}
                className="text-blue-600 hover:text-blue-700"
                disabled={loading}
              >
                Already have an account? Sign in
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-blue-700 mt-6">
          Need help? Contact our merchant support team.
        </p>
      </div>
    </div>
  );
};

export default MerchantSignup;
