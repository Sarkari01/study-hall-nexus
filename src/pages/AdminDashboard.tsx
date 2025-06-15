
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Settings, 
  Building2,
  UserPlus,
  FileText,
  Bell
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
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
      case "students":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Students Management</h2>
              <Button>Add New Student</Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>All Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Students module will be implemented in Step 2</p>
              </CardContent>
            </Card>
          </div>
        );
      
      case "merchants":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Merchants Management</h2>
              <Button>Add New Merchant</Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>All Merchants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Merchants module will be implemented in Step 3</p>
              </CardContent>
            </Card>
          </div>
        );

      case "study-halls":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Study Halls Management</h2>
              <Button>Add New Study Hall</Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>All Study Halls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Study Halls module will be implemented in Step 4</p>
              </CardContent>
            </Card>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
            <Card>
              <CardHeader>
                <CardTitle>Payment Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Payments module will be implemented in Step 5</p>
              </CardContent>
            </Card>
          </div>
        );

      case "transactions":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
            <Card>
              <CardHeader>
                <CardTitle>Transaction Ledger</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Transactions module will be implemented in Step 6</p>
              </CardContent>
            </Card>
          </div>
        );

      case "settle-now":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settle Now (Payouts)</h2>
            <Card>
              <CardHeader>
                <CardTitle>Pending Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Settle Now module will be implemented in Step 7</p>
              </CardContent>
            </Card>
          </div>
        );

      case "locations":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Locations</h2>
            <Card>
              <CardHeader>
                <CardTitle>Manage Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Locations module will be implemented in Step 8</p>
              </CardContent>
            </Card>
          </div>
        );

      case "leads":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
            <Card>
              <CardHeader>
                <CardTitle>All Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Leads module will be implemented in Step 9</p>
              </CardContent>
            </Card>
          </div>
        );

      case "daily-revenue":
      case "weekly-revenue":
      case "monthly-revenue":
      case "merchant-revenue":
      case "location-revenue":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Revenue Reports</h2>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Revenue module will be implemented in Step 10</p>
              </CardContent>
            </Card>
          </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Advanced Admin Dashboard</h1>
          <p className="text-gray-600">Comprehensive management system for study halls platform</p>
        </div>

        {renderModuleContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
