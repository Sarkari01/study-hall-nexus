
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Calendar, TrendingUp, AlertCircle, RefreshCw, Building2, BookOpen, CheckCircle, Clock, Award } from "lucide-react";
import DashboardStats from './DashboardStats';
import ErrorBoundary from "./ErrorBoundary";

interface QuickStat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

interface DashboardOverviewProps {
  onRefresh?: () => void;
  loading?: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onRefresh, loading = false }) => {
  const quickStats: QuickStat[] = [
    {
      title: "Today's Revenue",
      value: "₹12,450",
      change: "+12%",
      changeType: 'positive',
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: "Active Bookings",
      value: "34",
      change: "+5%",
      changeType: 'positive',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: "New Students",
      value: "8",
      change: "-2%",
      changeType: 'negative',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: "+3%",
      changeType: 'positive',
      icon: <TrendingUp className="h-5 w-5" />
    }
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <ErrorBoundary key={index}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {stat.icon}
                  </div>
                  <Badge variant="outline" className={getChangeColor(stat.changeType)}>
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </ErrorBoundary>
        ))}
      </div>

      {/* Main Statistics Grid */}
      <DashboardStats />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-xs">Manage Students</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Building2 className="h-6 w-6 mb-2" />
              <span className="text-xs">Study Halls</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-xs">View Bookings</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <DollarSign className="h-6 w-6 mb-2" />
              <span className="text-xs">Payments</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-xs">Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <AlertCircle className="h-6 w-6 mb-2" />
              <span className="text-xs">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { student: "Rahul Sharma", hall: "Study Hub Central", amount: "₹250", status: "confirmed" },
                { student: "Priya Patel", hall: "Focus Zone", amount: "₹180", status: "pending" },
                { student: "Amit Kumar", hall: "Silent Study", amount: "₹300", status: "confirmed" },
              ].map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{booking.student}</p>
                    <p className="text-sm text-gray-500">{booking.hall}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{booking.amount}</p>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: "Payment Gateway", status: "operational", uptime: "99.9%" },
                { service: "Database", status: "operational", uptime: "100%" },
                { service: "Notification Service", status: "degraded", uptime: "97.2%" },
                { service: "File Storage", status: "operational", uptime: "99.8%" },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{service.service}</p>
                    <p className="text-sm text-gray-500">Uptime: {service.uptime}</p>
                  </div>
                  <Badge variant={service.status === 'operational' ? 'default' : 'destructive'}>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
