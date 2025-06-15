
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Bell, Shield, CreditCard, Globe, Clock, Mail, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MerchantSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailBookings: true,
      smsBookings: true,
      emailPayments: true,
      smsPayments: false,
      emailUpdates: true,
      pushNotifications: true,
      weeklyReports: true,
      monthlyReports: true
    },
    business: {
      autoApproveBookings: false,
      requireAdvancePayment: true,
      cancellationPolicy: '24_hours',
      maxAdvanceBooking: '30',
      operatingHours: {
        start: '06:00',
        end: '23:00'
      },
      timezone: 'Asia/Kolkata',
      currency: 'INR'
    },
    payments: {
      acceptOnlinePayments: true,
      acceptCashPayments: false,
      autoSettle: true,
      settlementCycle: 'daily',
      minimumBookingAmount: 50
    },
    privacy: {
      profileVisibility: 'public',
      showContactInfo: true,
      allowReviews: true,
      dataRetention: '2_years'
    }
  });

  const { toast } = useToast();

  const handleSave = () => {
    // In production, save to API
    toast({
      title: "Success",
      description: "Settings updated successfully",
    });
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updateBusinessSetting = (key: string, value: any) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setSettings(prev => ({
        ...prev,
        business: {
          ...prev.business,
          [parent]: {
            ...(prev.business[parent as keyof typeof prev.business] as object),
            [child]: value
          }
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        business: {
          ...prev.business,
          [key]: value
        }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your account and business preferences</p>
        </div>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Booking Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>Email notifications for new bookings</span>
                    </div>
                    <Switch
                      checked={settings.notifications.emailBookings}
                      onCheckedChange={(checked) => updateNotificationSetting('emailBookings', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4 text-gray-400" />
                      <span>SMS notifications for new bookings</span>
                    </div>
                    <Switch
                      checked={settings.notifications.smsBookings}
                      onCheckedChange={(checked) => updateNotificationSetting('smsBookings', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Payment Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>Email notifications for payments</span>
                    </div>
                    <Switch
                      checked={settings.notifications.emailPayments}
                      onCheckedChange={(checked) => updateNotificationSetting('emailPayments', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4 text-gray-400" />
                      <span>SMS notifications for payments</span>
                    </div>
                    <Switch
                      checked={settings.notifications.smsPayments}
                      onCheckedChange={(checked) => updateNotificationSetting('smsPayments', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Reports & Updates</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Weekly business reports</span>
                    <Switch
                      checked={settings.notifications.weeklyReports}
                      onCheckedChange={(checked) => updateNotificationSetting('weeklyReports', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Monthly analytics reports</span>
                    <Switch
                      checked={settings.notifications.monthlyReports}
                      onCheckedChange={(checked) => updateNotificationSetting('monthlyReports', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Platform updates and announcements</span>
                    <Switch
                      checked={settings.notifications.emailUpdates}
                      onCheckedChange={(checked) => updateNotificationSetting('emailUpdates', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Business Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Auto-approve bookings</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.business.autoApproveBookings}
                      onCheckedChange={(checked) => updateBusinessSetting('autoApproveBookings', checked)}
                    />
                    <span className="text-sm text-gray-600">
                      Automatically approve booking requests
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Require advance payment</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.business.requireAdvancePayment}
                      onCheckedChange={(checked) => updateBusinessSetting('requireAdvancePayment', checked)}
                    />
                    <span className="text-sm text-gray-600">
                      Require payment before booking confirmation
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                  <Select 
                    value={settings.business.cancellationPolicy}
                    onValueChange={(value) => updateBusinessSetting('cancellationPolicy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_hour">1 hour before</SelectItem>
                      <SelectItem value="2_hours">2 hours before</SelectItem>
                      <SelectItem value="6_hours">6 hours before</SelectItem>
                      <SelectItem value="12_hours">12 hours before</SelectItem>
                      <SelectItem value="24_hours">24 hours before</SelectItem>
                      <SelectItem value="48_hours">48 hours before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAdvanceBooking">Maximum advance booking (days)</Label>
                  <Input
                    id="maxAdvanceBooking"
                    type="number"
                    value={settings.business.maxAdvanceBooking}
                    onChange={(e) => updateBusinessSetting('maxAdvanceBooking', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Operating Hours - Start</Label>
                  <Input
                    type="time"
                    value={settings.business.operatingHours.start}
                    onChange={(e) => updateBusinessSetting('operatingHours.start', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Operating Hours - End</Label>
                  <Input
                    type="time"
                    value={settings.business.operatingHours.end}
                    onChange={(e) => updateBusinessSetting('operatingHours.end', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={settings.business.timezone}
                    onValueChange={(value) => updateBusinessSetting('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="Asia/Mumbai">Asia/Mumbai (IST)</SelectItem>
                      <SelectItem value="Asia/Delhi">Asia/Delhi (IST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={settings.business.currency}
                    onValueChange={(value) => updateBusinessSetting('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Accept online payments</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.payments.acceptOnlinePayments}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        payments: { ...prev.payments, acceptOnlinePayments: checked }
                      }))}
                    />
                    <span className="text-sm text-gray-600">
                      Accept UPI, cards, and net banking
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Accept cash payments</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.payments.acceptCashPayments}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        payments: { ...prev.payments, acceptCashPayments: checked }
                      }))}
                    />
                    <span className="text-sm text-gray-600">
                      Allow pay-at-venue option
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Auto-settlement</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.payments.autoSettle}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        payments: { ...prev.payments, autoSettle: checked }
                      }))}
                    />
                    <span className="text-sm text-gray-600">
                      Automatically settle payments
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="settlementCycle">Settlement Cycle</Label>
                  <Select 
                    value={settings.payments.settlementCycle}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      payments: { ...prev.payments, settlementCycle: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumBookingAmount">Minimum booking amount (₹)</Label>
                  <Input
                    id="minimumBookingAmount"
                    type="number"
                    value={settings.payments.minimumBookingAmount}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      payments: { ...prev.payments, minimumBookingAmount: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select 
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, profileVisibility: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Show contact information</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.privacy.showContactInfo}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, showContactInfo: checked }
                      }))}
                    />
                    <span className="text-sm text-gray-600">
                      Display phone and email publicly
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Allow customer reviews</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.privacy.allowReviews}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, allowReviews: checked }
                      }))}
                    />
                    <span className="text-sm text-gray-600">
                      Let customers post reviews and ratings
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention Period</Label>
                  <Select 
                    value={settings.privacy.dataRetention}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, dataRetention: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_year">1 Year</SelectItem>
                      <SelectItem value="2_years">2 Years</SelectItem>
                      <SelectItem value="3_years">3 Years</SelectItem>
                      <SelectItem value="5_years">5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Data Security Notice</h4>
                <p className="text-sm text-yellow-700">
                  Your data is encrypted and stored securely. We comply with all applicable data protection regulations including GDPR and Indian IT laws.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MerchantSettings;
