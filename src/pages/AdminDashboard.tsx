import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, DollarSign, Calendar, TrendingUp, Settings, Building2, UserPlus, FileText, Bell, MessageSquare, Megaphone, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import StudentsTable from "@/components/admin/StudentsTable";
import MerchantsTable from "@/components/admin/MerchantsTable";
import StudyHallsTable from "@/components/admin/StudyHallsTable";
import BookingsTable from "@/components/admin/BookingsTable";
import TransactionsTable from "@/components/admin/TransactionsTable";
import SettleNowTable from "@/components/admin/SettleNowTable";
import LocationsTable from "@/components/admin/LocationsTable";
import LeadsTable from "@/components/admin/LeadsTable";
import RevenueReports from "@/components/admin/RevenueReports";
import BannerManager from "@/components/banners/BannerManager";
import CommunityFeed from "@/components/community/CommunityFeed";
import ChatSystem from "@/components/chat/ChatSystem";
import DeveloperManagement from "@/components/admin/DeveloperManagement";
import AIChatbot from "@/components/ai/AIChatbot";
import ContentModerator from "@/components/ai/ContentModerator";
import SmartTextAssistant from "@/components/ai/SmartTextAssistant";
import AIAnalyticsDashboard from "@/components/ai/AIAnalyticsDashboard";
import SubscriptionPlansTable from "@/components/admin/SubscriptionPlansTable";
import MerchantSubscriptionsTable from "@/components/admin/MerchantSubscriptionsTable";
import PaymentHistoryTable from "@/components/admin/PaymentHistoryTable";
import CouponsTable from "@/components/admin/CouponsTable";
import RewardRulesTable from "@/components/admin/RewardRulesTable";
import WalletManagement from "@/components/admin/WalletManagement";
import NotificationManager from "@/components/notifications/NotificationManager";
import DashboardStats from "@/components/admin/DashboardStats";
import DashboardCharts from "@/components/admin/DashboardCharts";
import RecentActivities from "@/components/admin/RecentActivities";
import UpcomingMerchants from "@/components/admin/UpcomingMerchants";
import DashboardOverview from "@/components/admin/DashboardOverview";
import GeneralSettings from "@/components/admin/GeneralSettings";
import ErrorBoundary from "@/components/admin/ErrorBoundary";
import { useNotifications } from "@/hooks/useNotifications";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useToast } from "@/hooks/use-toast";
import SafeStudyHallsWrapper from "@/components/admin/SafeStudyHallsWrapper";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock user data for development mode
  const mockUser = {
    id: 'demo-admin-id',
    email: 'admin@demo.com',
    user_metadata: {
      full_name: 'Demo Admin'
    }
  };

  console.log('AdminDashboard: Development mode - using mock auth data', {
    user: mockUser.email,
    role: 'admin'
  });

  // Enhanced dashboard data management
  const dashboardData = useDashboardData();

  // Initialize FCM
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

  const handleLogout = async () => {
    try {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "Profile settings coming soon!"
    });
  };

  const handleError = (error: Error) => {
    console.error('Dashboard error:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive"
    });
  };

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <ErrorBoundary onError={handleError}>
        <DashboardOverview 
          onRefresh={dashboardData.refreshAll}
          loading={dashboardData.loading}
        />
      </ErrorBoundary>

      {/* Enhanced Statistics Cards */}
      <ErrorBoundary onError={handleError}>
        <DashboardStats />
      </ErrorBoundary>

      {/* Interactive Charts and Graphs */}
      <ErrorBoundary onError={handleError}>
        <DashboardCharts />
      </ErrorBoundary>

      {/* Recent Activities and Merchant Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ErrorBoundary onError={handleError}>
            <UpcomingMerchants />
          </ErrorBoundary>
        </div>
        <div>
          <ErrorBoundary onError={handleError}>
            <RecentActivities />
          </ErrorBoundary>
        </div>
      </div>

      {/* Last Refresh Indicator */}
      {dashboardData.lastRefresh && (
        <div className="text-center text-sm text-gray-500">
          Last updated: {dashboardData.lastRefresh.toLocaleTimeString()}
        </div>
      )}
    </div>
  );

  const renderModuleContent = () => {
    const content = (() => {
      switch (activeTab) {
        case "dashboard":
          return renderDashboardContent();
        case "students":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Students Management</h2>
              </div>
              <StudentsTable />
            </div>
          );
        case "merchants":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Merchants Management</h2>
              </div>
              <MerchantsTable />
            </div>
          );
        case "study-halls":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Study Halls Management</h2>
              </div>
              <SafeStudyHallsWrapper />
            </div>
          );
        case "bookings":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
              </div>
              <BookingsTable />
            </div>
          );
        case "subscription-plans":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
              </div>
              <SubscriptionPlansTable />
            </div>
          );
        case "merchant-subscriptions":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Merchant Subscriptions</h2>
              </div>
              <MerchantSubscriptionsTable />
            </div>
          );
        case "payment-history":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
              </div>
              <PaymentHistoryTable />
            </div>
          );
        case "coupons":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
              </div>
              <CouponsTable />
            </div>
          );
        case "reward-rules":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Reward Rules</h2>
              </div>
              <RewardRulesTable />
            </div>
          );
        case "wallet-management":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Wallet Management</h2>
              </div>
              <WalletManagement />
            </div>
          );
        case "transactions":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Transaction Ledger</h2>
              </div>
              <TransactionsTable />
            </div>
          );
        case "settle-now":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
              </div>
              <SettleNowTable />
            </div>
          );
        case "locations":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Locations Management</h2>
                <Button>Add New Location</Button>
              </div>
              <LocationsTable />
            </div>
          );
        case "leads":
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
              </div>
              <LeadsTable />
            </div>
          );
        case "banners":
          return <BannerManager />;
        case "community":
          return <CommunityFeed />;
        case "chat":
          return <ChatSystem />;
        case "ai-chatbot":
          return <AIChatbot apiKey={getDeepSeekApiKey()} userType="admin" />;
        case "content-moderation":
          return <ContentModerator apiKey={getDeepSeekApiKey()} />;
        case "smart-text-assistant":
          return <SmartTextAssistant apiKey={getDeepSeekApiKey()} />;
        case "ai-analytics":
          return <AIAnalyticsDashboard apiKey={getDeepSeekApiKey()} />;
        case "developer-management":
          return <DeveloperManagement />;
        case "notifications":
          return <NotificationManager />;
        case "general-settings":
          return <GeneralSettings />;
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
              <RevenueReports reportType={activeTab} />
            </div>
          );
        default:
          return renderDashboardContent();
      }
    })();

    return (
      <ErrorBoundary onError={handleError}>
        {content}
      </ErrorBoundary>
    );
  };

  return (
    <ErrorBoundary onError={handleError}>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar 
          activeItem={activeTab} 
          onItemClick={setActiveTab} 
          expandedItems={expandedItems} 
          onToggleExpand={handleToggleExpand} 
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Header with title and profile section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'general-settings' ? 'General Settings' : 
                 activeTab === 'bookings' ? 'Bookings Management' : 
                 'Management Console'}
              </h1>
              <p className="text-gray-600">
                {activeTab === 'dashboard' ? 'Comprehensive management system for study halls platform' : 
                 activeTab === 'general-settings' ? 'Configure platform-wide settings and preferences' : 
                 activeTab === 'bookings' ? 'Manage and monitor all study hall bookings' : 
                 'Advanced administrative controls and monitoring'}
              </p>
            </div>

            {/* Profile and Notifications Section */}
            <div className="flex items-center space-x-4">
              {/* Notifications Button */}
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  3
                </Badge>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt="Admin" />
                      <AvatarFallback className="bg-blue-600 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium leading-none text-base">
                        {mockUser?.user_metadata?.full_name || 'Demo Admin'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {mockUser?.email || 'admin@demo.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("general-settings")} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
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
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
