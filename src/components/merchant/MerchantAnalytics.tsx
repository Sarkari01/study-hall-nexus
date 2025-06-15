
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Star, Building2 } from "lucide-react";

const MerchantAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data - in production this would come from your API
  const revenueData = [
    { name: 'Jan', revenue: 12000, bookings: 45 },
    { name: 'Feb', revenue: 15000, bookings: 52 },
    { name: 'Mar', revenue: 18000, bookings: 61 },
    { name: 'Apr', revenue: 22000, bookings: 73 },
    { name: 'May', revenue: 19000, bookings: 68 },
    { name: 'Jun', revenue: 25000, bookings: 84 }
  ];

  const studyHallPerformance = [
    { name: 'Premium Study Room A', occupancy: 85, revenue: 15000 },
    { name: 'Deluxe Study Hall B', occupancy: 72, revenue: 12000 },
    { name: 'Standard Room C', occupancy: 68, revenue: 8000 },
    { name: 'VIP Study Suite', occupancy: 92, revenue: 18000 }
  ];

  const bookingTypeData = [
    { name: 'Daily', value: 45, color: '#8884d8' },
    { name: 'Weekly', value: 30, color: '#82ca9d' },
    { name: 'Monthly', value: 25, color: '#ffc658' }
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "₹1,25,000",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: "Total Bookings",
      value: "384",
      change: "+8.2%",
      trend: "up",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: "Avg. Occupancy",
      value: "78%",
      change: "+5.1%",
      trend: "up",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Customer Rating",
      value: "4.6",
      change: "+0.3",
      trend: "up",
      icon: <Star className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Types */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {bookingTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Study Hall Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Study Hall Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studyHallPerformance.map((hall, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{hall.name}</p>
                    <p className="text-sm text-gray-600">Revenue: ₹{hall.revenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={hall.occupancy > 80 ? "default" : hall.occupancy > 60 ? "secondary" : "outline"}>
                    {hall.occupancy}% Occupied
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantAnalytics;
