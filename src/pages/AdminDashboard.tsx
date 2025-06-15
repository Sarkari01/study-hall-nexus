
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
import Sidebar from "@/components/Sidebar";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = [
    {
      title: "Total Revenue",
      value: "₹2,45,680",
      change: "+12.5%",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Bookings Today",
      value: "186",
      change: "+8.2%",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+15.3%",
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      title: "Growth Rate",
      value: "23.1%",
      change: "+2.4%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-orange-600"
    }
  ];

  const settlements = [
    { merchant: "Central Study Hub", amount: "₹15,680", status: "Completed", date: "Today" },
    { merchant: "Elite Library", amount: "₹12,450", status: "Pending", date: "Yesterday" },
    { merchant: "Study Zone Pro", amount: "₹8,920", status: "Processing", date: "2 days ago" },
    { merchant: "Focus Point", amount: "₹22,150", status: "Completed", date: "3 days ago" }
  ];

  const merchants = [
    { name: "Central Study Hub", location: "Mumbai", halls: 3, status: "Active" },
    { name: "Elite Library", location: "Delhi", halls: 2, status: "Active" },
    { name: "Study Zone Pro", location: "Bangalore", halls: 4, status: "Pending" },
    { name: "Focus Point", location: "Pune", halls: 1, status: "Active" }
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <TrendingUp className="h-5 w-5" /> },
    { id: "settlements", label: "Settlements", icon: <DollarSign className="h-5 w-5" /> },
    { id: "merchants", label: "Merchants", icon: <Building2 className="h-5 w-5" /> },
    { id: "news", label: "News", icon: <FileText className="h-5 w-5" /> },
    { id: "reports", label: "Reports", icon: <FileText className="h-5 w-5" /> },
    { id: "sub-admins", label: "Sub-Admins", icon: <UserPlus className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        items={sidebarItems} 
        activeItem={activeTab} 
        onItemClick={setActiveTab}
        title="Admin Panel"
      />
      
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your study hall network</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
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

            {/* Recent Settlements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Settlements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settlements.map((settlement, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{settlement.merchant}</p>
                        <p className="text-sm text-gray-600">{settlement.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">{settlement.amount}</span>
                        <Badge 
                          variant={settlement.status === 'Completed' ? 'default' : 
                                  settlement.status === 'Pending' ? 'destructive' : 'secondary'}
                        >
                          {settlement.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="merchants" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Merchant Management</h2>
              <Button>Add New Merchant</Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {merchants.map((merchant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{merchant.name}</p>
                        <p className="text-sm text-gray-600">{merchant.location} • {merchant.halls} halls</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={merchant.status === 'Active' ? 'default' : 'secondary'}>
                          {merchant.status}
                        </Badge>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sub-admins" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Sub-Admin Management</h2>
              <Button>Add Sub-Admin</Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Sub-Admin</CardTitle>
                <p className="text-sm text-gray-600">Assign limited access to team securely.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="admin@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                </div>
                
                <div>
                  <Label>Feature Access</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="settlements" className="rounded" />
                      <Label htmlFor="settlements">Settlements</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="merchants" className="rounded" />
                      <Label htmlFor="merchants">Merchants</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="reports" className="rounded" />
                      <Label htmlFor="reports">Reports</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="news" className="rounded" />
                      <Label htmlFor="news">News Management</Label>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">Create Sub-Admin</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
