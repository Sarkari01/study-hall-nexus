
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, DollarSign, Calendar, TrendingUp, Settings, Building2, UserPlus, FileText, Bell, MessageSquare, Megaphone } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import StudentsTable from "@/components/admin/StudentsTable";
import MerchantsTable from "@/components/admin/MerchantsTable";
import StudyHallsTable from "@/components/admin/StudyHallsTable";
import PaymentsTable from "@/components/admin/PaymentsTable";
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
import GeneralSettings from "@/components/admin/GeneralSettings";
import { useNotifications } from "@/hooks/useNotifications";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Initialize FCM
  const { fcmToken } = useNotifications();
  
  const handleToggleExpand = (itemId: string) => {
    setExpandedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  };
  
  const getDeepSeekApiKey = (): string | undefined => {
    return localStorage.getItem('deepseek_api_key') || undefined;
  };
  
  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Enhanced Statistics Cards */}
      <DashboardStats />

      {/* Interactive Charts and Graphs */}
      <DashboardCharts />

      {/* Recent Activities and Merchant Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingMerchants />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("students")}>
              <Users className="h-6 w-6 mb-2" />
              View Students
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("merchants")}>
              <Building2 className="h-6 w-6 mb-2" />
              Manage Merchants
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("payments")}>
              <DollarSign className="h-6 w-6 mb-2" />
              View Payments
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("study-halls")}>
              <Calendar className="h-6 w-6 mb-2" />
              Study Halls
            </Button>
          </div>
        </CardContent>
      </Card>
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
            <StudyHallsTable />
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
      case "payments":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Payment Transactions</h2>
            </div>
            <PaymentsTable />
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
              <h2 className="text-2xl font-bold text-gray-900">Settle Now (Payouts)</h2>
              <Button>Process All Eligible</Button>
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
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar 
        activeItem={activeTab} 
        onItemClick={setActiveTab} 
        expandedItems={expandedItems} 
        onToggleExpand={handleToggleExpand} 
      />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'dashboard' ? 'Dashboard' : 
             activeTab === 'general-settings' ? 'General Settings' :
             'Management Console'}
          </h1>
          <p className="text-gray-600">
            {activeTab === 'dashboard' ? 'Comprehensive management system for study halls platform' :
             activeTab === 'general-settings' ? 'Configure platform-wide settings and preferences' :
             'Advanced administrative controls and monitoring'}
          </p>
        </div>

        <div className="max-w-full">
          {renderModuleContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
