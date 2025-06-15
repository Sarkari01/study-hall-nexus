
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, RefreshCw, Globe, Shield, Bell, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlatformSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailVerificationRequired: boolean;
  defaultBookingDuration: number;
  maxBookingsPerUser: number;
  commissionRate: number;
  autoSettlement: boolean;
  settlementSchedule: string;
  supportEmail: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
}

const GeneralSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PlatformSettings>({
    siteName: "Sarkari Ninja",
    siteDescription: "Premium study hall booking platform for students",
    maintenanceMode: false,
    allowRegistrations: true,
    emailVerificationRequired: true,
    defaultBookingDuration: 2,
    maxBookingsPerUser: 5,
    commissionRate: 15,
    autoSettlement: true,
    settlementSchedule: "weekly",
    supportEmail: "support@sarkarininja.com",
    privacyPolicyUrl: "",
    termsOfServiceUrl: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings saved",
        description: "Platform settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      siteName: "Sarkari Ninja",
      siteDescription: "Premium study hall booking platform for students",
      maintenanceMode: false,
      allowRegistrations: true,
      emailVerificationRequired: true,
      defaultBookingDuration: 2,
      maxBookingsPerUser: 5,
      commissionRate: 15,
      autoSettlement: true,
      settlementSchedule: "weekly",
      supportEmail: "support@sarkarininja.com",
      privacyPolicyUrl: "",
      termsOfServiceUrl: ""
    });
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>
          <p className="text-gray-600">Manage platform-wide configurations and preferences</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Site Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                placeholder="Enter site name"
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                placeholder="Enter site description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                placeholder="support@example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-gray-600">Temporarily disable public access</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow New Registrations</Label>
                <p className="text-sm text-gray-600">Enable user registration</p>
              </div>
              <Switch
                checked={settings.allowRegistrations}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowRegistrations: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Verification Required</Label>
                <p className="text-sm text-gray-600">Require email verification for new users</p>
              </div>
              <Switch
                checked={settings.emailVerificationRequired}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailVerificationRequired: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Booking Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="defaultDuration">Default Booking Duration (hours)</Label>
              <Input
                id="defaultDuration"
                type="number"
                min="1"
                max="24"
                value={settings.defaultBookingDuration}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultBookingDuration: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="maxBookings">Max Bookings Per User</Label>
              <Input
                id="maxBookings"
                type="number"
                min="1"
                max="20"
                value={settings.maxBookingsPerUser}
                onChange={(e) => setSettings(prev => ({ ...prev, maxBookingsPerUser: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={settings.commissionRate}
                onChange={(e) => setSettings(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment & Settlement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Payment & Settlement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Settlement</Label>
                <p className="text-sm text-gray-600">Automatically process settlements</p>
              </div>
              <Switch
                checked={settings.autoSettlement}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSettlement: checked }))}
              />
            </div>
            <div>
              <Label htmlFor="settlementSchedule">Settlement Schedule</Label>
              <Select
                value={settings.settlementSchedule}
                onValueChange={(value) => setSettings(prev => ({ ...prev, settlementSchedule: value }))}
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
          </CardContent>
        </Card>

        {/* Legal Links */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Legal & Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="privacyPolicy">Privacy Policy URL</Label>
                <Input
                  id="privacyPolicy"
                  type="url"
                  value={settings.privacyPolicyUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, privacyPolicyUrl: e.target.value }))}
                  placeholder="https://example.com/privacy"
                />
              </div>
              <div>
                <Label htmlFor="termsOfService">Terms of Service URL</Label>
                <Input
                  id="termsOfService"
                  type="url"
                  value={settings.termsOfServiceUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, termsOfServiceUrl: e.target.value }))}
                  placeholder="https://example.com/terms"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant={settings.maintenanceMode ? "destructive" : "default"}>
              {settings.maintenanceMode ? "Maintenance Mode" : "Live"}
            </Badge>
            <Badge variant={settings.allowRegistrations ? "default" : "secondary"}>
              {settings.allowRegistrations ? "Registrations Open" : "Registrations Closed"}
            </Badge>
            <Badge variant={settings.autoSettlement ? "default" : "secondary"}>
              {settings.autoSettlement ? "Auto Settlement" : "Manual Settlement"}
            </Badge>
            <Badge variant="outline">
              Commission: {settings.commissionRate}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
