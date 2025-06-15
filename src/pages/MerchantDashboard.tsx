
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus,
  QrCode,
  Users,
  Calendar,
  DollarSign,
  Settings,
  BarChart3,
  Upload,
  Grid3X3,
  Tag
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLayout, setSelectedLayout] = useState("A1-F6");

  const stats = [
    {
      title: "Today's Bookings",
      value: "24",
      change: "+8",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Revenue Today",
      value: "₹12,560",
      change: "+15.2%",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Occupancy Rate",
      value: "78%",
      change: "+5%",
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      title: "Total Seats",
      value: "45",
      change: "0",
      icon: <Grid3X3 className="h-5 w-5" />,
      color: "text-orange-600"
    }
  ];

  const bookings = [
    {
      user: "Rahul Kumar",
      seat: "A2",
      duration: "4 hours",
      amount: "₹200",
      status: "Paid",
      time: "09:00 AM"
    },
    {
      user: "Priya Sharma",
      seat: "B5",
      duration: "6 hours",
      amount: "₹300",
      status: "Unpaid",
      time: "10:30 AM"
    },
    {
      user: "Arjun Patel",
      seat: "C1",
      duration: "8 hours",
      amount: "₹400",
      status: "Paid",
      time: "08:00 AM"
    }
  ];

  const cabinGroups = [
    {
      name: "Ground Floor - Zone A",
      seats: 20,
      occupied: 15,
      price: "₹50/hour",
      layout: "A1-A20"
    },
    {
      name: "First Floor - Zone B",
      seats: 25,
      occupied: 18,
      price: "₹60/hour",
      layout: "B1-B25"
    }
  ];

  const coupons = [
    {
      code: "STUDENT20",
      discount: "20%",
      expiry: "31 Dec 2024",
      used: 45,
      limit: 100
    },
    {
      code: "FIRST50",
      discount: "₹50",
      expiry: "15 Jul 2024",
      used: 23,
      limit: 50
    }
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "cabins", label: "Cabin Groups", icon: <Grid3X3 className="h-5 w-5" /> },
    { id: "bookings", label: "Bookings", icon: <Calendar className="h-5 w-5" /> },
    { id: "qr-generator", label: "QR Generator", icon: <QrCode className="h-5 w-5" /> },
    { id: "coupons", label: "Coupons", icon: <Tag className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> }
  ];

  const LayoutSelector = () => {
    const layouts = [
      { id: "A1-F6", name: "6x6 Grid", description: "Standard layout with 36 seats" },
      { id: "A1-E5", name: "5x5 Grid", description: "Compact layout with 25 seats" },
      { id: "A1-H8", name: "8x8 Grid", description: "Large layout with 64 seats" }
    ];

    return (
      <div className="space-y-3">
        <Label>Layout Selector</Label>
        <p className="text-sm text-gray-600">Drag to rearrange seats like a movie layout.</p>
        <div className="grid grid-cols-1 gap-3">
          {layouts.map((layout) => (
            <div
              key={layout.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedLayout === layout.id 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedLayout(layout.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{layout.name}</p>
                  <p className="text-sm text-gray-600">{layout.description}</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded grid place-items-center">
                  <Grid3X3 className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        items={sidebarItems} 
        activeItem={activeTab} 
        onItemClick={setActiveTab}
        title="Merchant Panel"
      />
      
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Merchant Dashboard</h1>
          <p className="text-gray-600">Manage your study hall operations</p>
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
                          +{stat.change} from yesterday
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

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{booking.user}</p>
                        <p className="text-sm text-gray-600">
                          Seat {booking.seat} • {booking.duration} • {booking.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">{booking.amount}</span>
                        <Badge 
                          variant={booking.status === 'Paid' ? 'default' : 'destructive'}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cabins" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Cabin Groups</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Cabin Group
              </Button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Cabin Group</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input id="groupName" placeholder="e.g., Ground Floor - Zone A" />
                  </div>
                  
                  <LayoutSelector />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hourlyRate">Hourly Rate</Label>
                      <Input id="hourlyRate" placeholder="₹50" />
                    </div>
                    <div>
                      <Label htmlFor="dailyRate">Daily Rate</Label>
                      <Input id="dailyRate" placeholder="₹400" />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Upload Images</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                  
                  <Button className="w-full">Create Cabin Group</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Cabin Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cabinGroups.map((group, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{group.name}</h3>
                          <Badge variant="outline">{group.layout}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Total Seats: {group.seats}</p>
                          <p>Currently Occupied: {group.occupied}</p>
                          <p>Price: {group.price}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">View Layout</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="qr-generator" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">QR Code Generator</h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate QR Code</CardTitle>
                  <p className="text-sm text-gray-600">Create QR posters to increase walk-in bookings.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Cabin Group</Label>
                    <select className="w-full p-2 border rounded-lg">
                      <option>Ground Floor - Zone A</option>
                      <option>First Floor - Zone B</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>QR Code Type</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="booking" name="qrType" className="rounded" />
                        <Label htmlFor="booking">Direct Booking</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="info" name="qrType" className="rounded" />
                        <Label htmlFor="info">Hall Information</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">Generate QR Code</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR Code Preview</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    QR code will appear here after generation
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Download PNG</Button>
                    <Button variant="outline" className="flex-1">Download PDF</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Coupon
              </Button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Coupon</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="couponCode">Coupon Code</Label>
                    <Input id="couponCode" placeholder="e.g., STUDENT20" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Discount Type</Label>
                      <select className="w-full p-2 border rounded-lg">
                        <option>Percentage</option>
                        <option>Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="discountValue">Discount Value</Label>
                      <Input id="discountValue" placeholder="20" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="usageLimit">Usage Limit</Label>
                      <Input id="usageLimit" placeholder="100" />
                    </div>
                  </div>
                  
                  <Button className="w-full">Create Coupon</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {coupons.map((coupon, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-mono font-bold text-gray-900">{coupon.code}</h3>
                          <Badge variant="outline">{coupon.discount}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Expires: {coupon.expiry}</p>
                          <p>Used: {coupon.used}/{coupon.limit}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Deactivate</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MerchantDashboard;
