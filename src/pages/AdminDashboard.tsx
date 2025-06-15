
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, DollarSign, Calendar, TrendingUp, Settings, Building2, UserPlus, Bell, MessageSquare, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import AdminSidebar from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/admin/DashboardStats";
import DashboardCharts from "@/components/admin/DashboardCharts";

// Placeholder components for missing functionality
const PlaceholderComponent = ({ title }: { title: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-500">This feature is coming soon...</p>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { toast } = useToast();
  const { fcmToken } = useNotifications();

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const getDeepSeekApiKey = (): string | undefined => {
    return localStorage.getItem('deepseek_api_key') || undefined;
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "Profile settings coming soon!"
    });
  };

  const renderDashboardContent = () => (
    <div className="space-y-6">
      <DashboardStats />
      <DashboardCharts />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlaceholderComponent title="Upcoming Merchants" />
        </div>
        <div>
          <PlaceholderComponent title="Recent Activities" />
        </div>
      </div>
    </div>
  );

  const renderModuleContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent();
      case "students":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Students Management</h2>
            </div>
            <PlaceholderComponent title="Students Table" />
          </div>
        );
      case "merchants":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Merchants Management</h2>
            </div>
            <PlaceholderComponent title="Merchants Table" />
          </div>
        );
      case "study-halls":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Study Halls Management</h2>
            </div>
            <PlaceholderComponent title="Study Halls Table" />
          </div>
        );
      case "bookings":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
            </div>
            <PlaceholderComponent title="Bookings Table" />
          </div>
        );
      case "subscription-plans":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
            </div>
            <PlaceholderComponent title="Subscription Plans Table" />
          </div>
        );
      case "merchant-subscriptions":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Merchant Subscriptions</h2>
            </div>
            <PlaceholderComponent title="Merchant Subscriptions Table" />
          </div>
        );
      case "payment-history":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
            </div>
            <PlaceholderComponent title="Payment History Table" />
          </div>
        );
      case "coupons":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
            </div>
            <PlaceholderComponent title="Coupons Table" />
          </div>
        );
      case "reward-rules":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Reward Rules</h2>
            </div>
            <PlaceholderComponent title="Reward Rules Table" />
          </div>
        );
      case "wallet-management":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Wallet Management</h2>
            </div>
            <PlaceholderComponent title="Wallet Management" />
          </div>
        );
      case "transactions":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Transaction Ledger</h2>
            </div>
            <PlaceholderComponent title="Transactions Table" />
          </div>
        );
      case "settle-now":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Settle Now (Payouts)</h2>
            </div>
            <PlaceholderComponent title="Settle Now Table" />
          </div>
        );
      case "locations":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Locations Management</h2>
              <Button>Add New Location</Button>
            </div>
            <PlaceholderComponent title="Locations Table" />
          </div>
        );
      case "leads":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
            </div>
            <PlaceholderComponent title="Leads Table" />
          </div>
        );
      case "banners":
        return <PlaceholderComponent title="Banner Manager" />;
      case "community":
        return <PlaceholderComponent title="Community Feed" />;
      case "chat":
        return <PlaceholderComponent title="Chat System" />;
      case "ai-chatbot":
        return <PlaceholderComponent title="AI Chatbot" />;
      case "content-moderation":
        return <PlaceholderComponent title="Content Moderation" />;
      case "smart-text-assistant":
        return <PlaceholderComponent title="Smart Text Assistant" />;
      case "ai-analytics":
        return <PlaceholderComponent title="AI Analytics Dashboard" />;
      case "developer-management":
        return <PlaceholderComponent title="Developer Management" />;
      case "notifications":
        return <PlaceholderComponent title="Notification Manager" />;
      case "general-settings":
        return <PlaceholderComponent title="General Settings" />;
      case "daily-revenue":
      case "weekly-revenue":
      case "monthly-revenue":
      case "merchant-revenue":
      case "location-revenue":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Revenue Reports & Analytics</h2>
            </div>
            <PlaceholderComponent title="Revenue Reports" />
          </div>
        );
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar 
        activeItem={activeTab} 
        onItemClick={setActiveTab} 
        expandedItems={expandedItems} 
        onToggleExpand={handleToggleExpand} 
      />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'general-settings' ? 'General Settings' : 
                 activeTab === 'bookings' ? 'Bookings Management' : 
                 'Management Console'}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === 'dashboard' ? 'Comprehensive management system for study halls platform' : 
                 activeTab === 'general-settings' ? 'Configure platform-wide settings and preferences' : 
                 activeTab === 'bookings' ? 'Manage and monitor all study hall bookings' : 
                 'Advanced administrative controls and monitoring'}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="relative hover:bg-blue-50 border-gray-200 transition-all duration-200 hover:scale-105">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 animate-pulse">
                  3
                </Badge>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-blue-50 transition-all duration-200 hover:scale-105">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                      <AvatarImage src="" alt="Admin" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 shadow-lg border-gray-200" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@sarkarininja.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer hover:bg-blue-50">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("general-settings")} className="cursor-pointer hover:bg-blue-50">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="max-w-full">
            {renderModuleContent()}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
