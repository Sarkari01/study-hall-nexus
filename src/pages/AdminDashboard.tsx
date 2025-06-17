
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  Settings, 
  UserCheck,
  LogOut,
  BarChart3,
  FileText,
  Bell,
  Shield
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardOverview from "@/components/admin/DashboardOverview";
import StudentsTable from "@/components/admin/StudentsTable";
import MerchantsTable from "@/components/admin/MerchantsTable";
import BookingsTable from "@/components/admin/BookingsTable";
import StudyHallsTable from "@/components/admin/StudyHallsTable";
import RoleManagementTab from "@/components/admin/RoleManagementTab";
import ErrorBoundary from "@/components/ErrorBoundary";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, userRole, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const tabItems = [
    { value: "overview", label: "Overview", icon: BarChart3 },
    { value: "students", label: "Students", icon: Users },
    { value: "merchants", label: "Merchants", icon: Building2 },
    { value: "bookings", label: "Bookings", icon: Calendar },
    { value: "study-halls", label: "Study Halls", icon: Building2 },
    { value: "roles", label: "Role Management", icon: Shield },
    { value: "reports", label: "Reports", icon: FileText },
    { value: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <Badge variant="outline" className="ml-3">
                  {userRole?.name || 'admin'}
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{user?.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <ErrorBoundary>
              <TabsContent value="overview" className="space-y-6">
                <DashboardOverview />
              </TabsContent>

              <TabsContent value="students" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Students Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StudentsTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="merchants" className="space-y-6">
                <MerchantsTable />
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Bookings Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BookingsTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="study-halls" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Study Halls Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StudyHallsTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roles" className="space-y-6">
                <RoleManagementTab />
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Reports & Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Reports Coming Soon</h3>
                      <p className="text-gray-500">Advanced reporting and analytics features will be available here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      System Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
                      <p className="text-gray-500">System configuration and settings will be available here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </ErrorBoundary>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;
