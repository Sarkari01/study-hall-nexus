import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, MapPin, Phone, Mail, Edit, Save, X, Camera, Shield, CreditCard, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MerchantProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    personalInfo: {
      fullName: "Sneha Patel",
      email: "sneha@studyspace.com",
      phone: "+91 98765 43210",
      dateOfBirth: "1985-05-15",
      gender: "Female"
    },
    businessInfo: {
      businessName: "StudySpace Pro",
      businessType: "Study Hall Chain",
      gstNumber: "29ABCDE1234F1Z5",
      panNumber: "ABCDE1234F",
      businessAddress: {
        street: "123 Business District",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        country: "India"
      },
      businessPhone: "+91 11 4567 8900",
      businessEmail: "business@studyspace.com",
      website: "www.studyspace.com",
      description: "Premium study spaces for serious learners with modern amenities and 24/7 access."
    },
    bankDetails: {
      accountHolderName: "StudySpace Pro Pvt Ltd",
      accountNumber: "1234567890123456",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      branch: "Connaught Place"
    },
    verification: {
      emailVerified: true,
      phoneVerified: true,
      businessVerified: true,
      documentsVerified: true,
      kycStatus: "completed"
    }
  });

  const { toast } = useToast();

  const handleSave = () => {
    // In production, save to API
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const getVerificationColor = (verified: boolean) => {
    return verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg" alt={profile.personalInfo.fullName} />
                  <AvatarFallback className="text-2xl">
                    {profile.personalInfo.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  variant="outline"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.personalInfo.fullName}</h2>
                <p className="text-lg text-gray-600">{profile.businessInfo.businessName}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getVerificationColor(profile.verification.businessVerified)}>
                    <Shield className="h-3 w-3 mr-1" />
                    {profile.verification.businessVerified ? 'Verified Business' : 'Unverified'}
                  </Badge>
                  <Badge variant="outline">
                    KYC: {profile.verification.kycStatus}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.personalInfo.fullName}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.personalInfo.phone}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profile.personalInfo.dateOfBirth}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Information */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Business Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={profile.businessInfo.businessName}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, businessName: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    value={profile.businessInfo.businessType}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, businessType: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={profile.businessInfo.gstNumber}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, gstNumber: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={profile.businessInfo.panNumber}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, panNumber: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={profile.businessInfo.businessPhone}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, businessPhone: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.businessInfo.website}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      businessInfo: { ...prev.businessInfo, website: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={profile.businessInfo.description}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    businessInfo: { ...prev.businessInfo, description: e.target.value }
                  }))}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Information */}
        <TabsContent value="banking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Banking Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    value={profile.bankDetails.accountHolderName}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, accountHolderName: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={profile.bankDetails.accountNumber}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                    }))}
                    disabled={!isEditing}
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={profile.bankDetails.ifscCode}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, ifscCode: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={profile.bankDetails.bankName}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, bankName: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    value={profile.bankDetails.branch}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, branch: e.target.value }
                    }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Status */}
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Verification Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">Email Verification</span>
                    </div>
                    <Badge className={getVerificationColor(profile.verification.emailVerified)}>
                      {profile.verification.emailVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">Phone Verification</span>
                    </div>
                    <Badge className={getVerificationColor(profile.verification.phoneVerified)}>
                      {profile.verification.phoneVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">Business Verification</span>
                    </div>
                    <Badge className={getVerificationColor(profile.verification.businessVerified)}>
                      {profile.verification.businessVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">Document Verification</span>
                    </div>
                    <Badge className={getVerificationColor(profile.verification.documentsVerified)}>
                      {profile.verification.documentsVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">KYC Status: {profile.verification.kycStatus}</h4>
                  <p className="text-sm text-blue-700">
                    Your KYC verification is complete. You can now access all platform features including payments and settlements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MerchantProfile;
