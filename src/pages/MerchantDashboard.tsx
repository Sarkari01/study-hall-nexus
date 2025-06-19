import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useMerchantProfile } from '@/hooks/useMerchantProfile';
import { Building2, Store, Calendar, DollarSign, Users, LogOut, User, Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const MerchantDashboard = () => {
  const { userProfile, signOut } = useAuth();
  const { merchantProfile, loading: merchantLoading } = useMerchantProfile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Merchant Dashboard</h1>
                <p className="text-gray-600">Welcome, {merchantProfile?.business_name || userProfile?.full_name || 'Merchant'}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="study-halls">Study Halls</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Halls</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Active halls</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹0</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Current sessions</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                    <Store className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Add Study Hall</p>
                    <p className="text-sm text-gray-500">Create a new study hall listing</p>
                  </div>
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                    <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Manage Bookings</p>
                    <p className="text-sm text-gray-500">View and manage customer bookings</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">No recent activity</div>
                    <p className="text-sm text-gray-500">Your business activity will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="study-halls">
            <Card>
              <CardHeader>
                <CardTitle>Study Halls Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No study halls found</p>
                  <p className="text-sm text-gray-500">Create your first study hall to get started</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No bookings found</p>
                  <p className="text-sm text-gray-500">Customer bookings will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Analytics coming soon</p>
                  <p className="text-sm text-gray-500">Track your business performance and insights</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {merchantLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business Name</label>
                        <p className="text-gray-900">{merchantProfile?.business_name || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business Phone</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {merchantProfile?.business_phone || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {merchantProfile?.email || userProfile?.full_name || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Business Address</label>
                        <p className="text-gray-900 flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          {merchantProfile?.business_address ? 
                            `${merchantProfile.business_address.street || ''}, ${merchantProfile.business_address.city || ''}, ${merchantProfile.business_address.state || ''} ${merchantProfile.business_address.pincode || ''}`.replace(/^,\s*|,\s*$/g, '') 
                            : 'Not set'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Approval Status</label>
                        <p className="text-gray-900 capitalize">{merchantProfile?.approval_status || 'pending'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Verification Status</label>
                        <p className="text-gray-900 capitalize">{merchantProfile?.verification_status || 'unverified'}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Incharge Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Incharge Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {merchantLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {merchantProfile?.incharge_name ? (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Full Name</label>
                            <p className="text-gray-900">{merchantProfile.incharge_name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Designation</label>
                            <p className="text-gray-900">{merchantProfile.incharge_designation || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Phone</label>
                            <p className="text-gray-900 flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {merchantProfile.incharge_phone || 'Not set'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-gray-900 flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {merchantProfile.incharge_email || 'Not set'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Address</label>
                            <p className="text-gray-900 flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5" />
                              {merchantProfile.incharge_address ? 
                                `${merchantProfile.incharge_address.street || ''}, ${merchantProfile.incharge_address.city || ''}, ${merchantProfile.incharge_address.state || ''} ${merchantProfile.incharge_address.pincode || ''}`.replace(/^,\s*|,\s*$/g, '') 
                                : 'Not set'
                              }
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">No incharge details found</p>
                          <p className="text-sm text-gray-500">Incharge information will appear here when available</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MerchantDashboard;
