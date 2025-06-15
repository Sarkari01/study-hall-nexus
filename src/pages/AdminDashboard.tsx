import React, { useState } from 'react';
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
import RoleManagement from "@/components/admin/RoleManagement";
import UserRoleAssignment from "@/components/admin/UserRoleAssignment";
import PermissionChecker from "@/components/admin/PermissionChecker";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  };

  const stats = [
    {
      title: "Total Students",
      value: "2,350",
      change: "+15.3%",
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      title: "Active Merchants",
      value: "186",
      change: "+8.2%",
      icon: <Building2 className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Total Revenue",
      value: "₹2,45,680",
      change: "+12.5%",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Growth Rate",
      value: "23.1%",
      change: "+2.4%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-orange-600"
    }
  ];

  const renderModuleContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
      case "students":
        return (
          <PermissionChecker permission="students.read" fallback={
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have permission to view students.</p>
            </div>
          }>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Students Management</h2>
                <PermissionChecker permission="students.write">
                  <Button>Add New Student</Button>
                </PermissionChecker>
              </div>
              <StudentsTable />
            </div>
          </PermissionChecker>
        );
      case "merchants":
        return (
          <PermissionChecker permission="merchants.read" fallback={
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have permission to view merchants.</p>
            </div>
          }>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Merchants Management</h2>
                <PermissionChecker permission="merchants.write">
                  <Button>Add New Merchant</Button>
                </PermissionChecker>
              </div>
              <MerchantsTable />
            </div>
          </PermissionChecker>
        );
      case "study-halls":
        return (
          <PermissionChecker permission="study_halls.read" fallback={
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have permission to view study halls.</p>
            </div>
          }>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Study Halls Management</h2>
                <PermissionChecker permission="study_halls.write">
                  <Button>Add New Study Hall</Button>
                </PermissionChecker>
              </div>
              <StudyHallsTable />
            </div>
          </PermissionChecker>
        );
      case "payments":
        return (
          <PermissionChecker permission="payments.read" fallback={
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have permission to view payments.</p>
            </div>
          }>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Payment Transactions</h2>
                <PermissionChecker permission="payments.export">
                  <Button>Export Payments</Button>
                </PermissionChecker>
              </div>
              <PaymentsTable />
            </div>
          </PermissionChecker>
        );
      case "role-management":
        return (
          <PermissionChecker permission="users.roles" fallback={
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have permission to manage roles.</p>
            </div>
          }>
            <RoleManagement />
          </PermissionChecker>
        );
      case "user-roles":
        return (
          <PermissionChecker permission="users.roles" fallback={
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have permission to assign user roles.</p>
            </div>
          }>
            <UserRoleAssignment />
          </PermissionChecker>
        );
      case "transactions":
        return (
          <PermissionChecker permission="payments.read">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Transaction Ledger</h2>
                <PermissionChecker permission="payments.export">
                  <Button>Export Transactions</Button>
                </PermissionChecker>
              </div>
              <TransactionsTable />
            </div>
          </PermissionChecker>
        );
      case "settle-now":
        return (
          <PermissionChecker permission="payments.process">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Settle Now (Payouts)</h2>
                <Button>Process All Eligible</Button>
              </div>
              <SettleNowTable />
            </div>
          </PermissionChecker>
        );
      case "locations":
        return (
          <PermissionChecker permission="study_halls.read">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Locations Management</h2>
                <PermissionChecker permission="study_halls.write">
                  <Button>Add New Location</Button>
                </PermissionChecker>
              </div>
              <LocationsTable />
            </div>
          </PermissionChecker>
        );
      case "leads":
        return (
          <PermissionChecker permission="users.read">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
                <Button>Export Leads</Button>
              </div>
              <LeadsTable />
            </div>
          </PermissionChecker>
        );
      case "banners":
        return (
          <PermissionChecker permission="settings.write">
            <BannerManager />
          </PermissionChecker>
        );
      case "community":
        return <CommunityFeed />;
      case "chat":
        return <ChatSystem />;
      case "ai-chatbot":
        return <AIChatbot apiKey={getDeepSeekApiKey()} userType="admin" />;
      case "content-moderation":
        return (
          <PermissionChecker permission="settings.write">
            <ContentModerator apiKey={getDeepSeekApiKey()} />
          </PermissionChecker>
        );
      case "smart-text-assistant":
        return <SmartTextAssistant apiKey={getDeepSeekApiKey()} />;
      case "ai-analytics":
        return (
          <PermissionChecker permission="reports.read">
            <AIAnalyticsDashboard apiKey={getDeepSeekApiKey()} />
          </PermissionChecker>
        );
      case "developer-management":
        return (
          <PermissionChecker permission="settings.write" fallback={
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have permission to access developer settings.</p>
            </div>
          }>
            <DeveloperManagement />
          </PermissionChecker>
        );
      case "daily-revenue":
      case "weekly-revenue":
      case "monthly-revenue":
      case "merchant-revenue":
      case "location-revenue":
        return (
          <PermissionChecker permission="reports.read" fallback={
            <div className="text-center py-8">
              <p className="text-gray-500">You don't have permission to view reports.</p>
            </div>
          }>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Revenue Reports & Analytics</h2>
                <PermissionChecker permission="reports.export">
                  <Button>Export Report</Button>
                </PermissionChecker>
              </div>
              <RevenueReports reportType={activeTab} />
            </div>
          </PermissionChecker>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    View Students
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Building2 className="h-6 w-6 mb-2" />
                    Manage Merchants
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <DollarSign className="h-6 w-6 mb-2" />
                    Process Payouts
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  const getDeepSeekApiKey = (): string | undefined => {
    // Get the API key from localStorage (set by DeveloperManagement component)
    return localStorage.getItem('deepseek_api_key') || undefined;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar 
        activeItem={activeTab} 
        onItemClick={setActiveTab} 
        expandedItems={expandedItems} 
        onToggleExpand={handleToggleExpand} 
      />
      
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Comprehensive management system for study halls platform</p>
        </div>

        {renderModuleContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
