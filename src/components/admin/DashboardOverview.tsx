
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Calendar, TrendingUp, AlertCircle, RefreshCw, Building2, BookOpen, CheckCircle, Clock, Award } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { useMerchants } from "@/hooks/useMerchants";
import { useBookings } from "@/hooks/useBookings";
import { useStudyHalls } from "@/hooks/useStudyHalls";
import DashboardStats from './DashboardStats';
import UpcomingMerchants from './UpcomingMerchants';
import ErrorBoundary from "./ErrorBoundary";

interface DashboardOverviewProps {
  onRefresh?: () => void;
  loading?: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onRefresh, loading: externalLoading = false }) => {
  const { students, loading: studentsLoading, fetchStudents } = useStudents();
  const { merchants, loading: merchantsLoading, fetchMerchants } = useMerchants();
  const { bookings, loading: bookingsLoading, fetchBookings } = useBookings();
  const { studyHalls, loading: studyHallsLoading, fetchStudyHalls } = useStudyHalls();

  const loading = externalLoading || studentsLoading || merchantsLoading || bookingsLoading || studyHallsLoading;

  // Calculate stats from real data
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalMerchants = merchants.length;
  const approvedMerchants = merchants.filter(m => m.approval_status === 'approved').length;
  const totalBookings = bookings.length;
  const todaysBookings = bookings.filter(b => 
    new Date(b.booking_date).toDateString() === new Date().toDateString()
  ).length;
  const totalRevenue = bookings
    .filter(b => b.payment_status === 'paid')
    .reduce((sum, b) => sum + b.final_amount, 0);
  const todaysRevenue = bookings
    .filter(b => 
      new Date(b.booking_date).toDateString() === new Date().toDateString() &&
      b.payment_status === 'paid'
    )
    .reduce((sum, b) => sum + b.final_amount, 0);

  const handleRefreshAll = () => {
    fetchStudents();
    fetchMerchants();
    fetchBookings();
    fetchStudyHalls();
    onRefresh?.();
  };

  const quickStats = [
    {
      title: "Today's Revenue",
      value: `₹${todaysRevenue.toLocaleString()}`,
      change: "+12%",
      changeType: 'positive' as const,
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: "Today's Bookings",
      value: todaysBookings.toString(),
      change: "+5%",
      changeType: 'positive' as const,
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: "Active Students",
      value: activeStudents.toString(),
      change: `${totalStudents} total`,
      changeType: 'neutral' as const,
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Approved Merchants",
      value: approvedMerchants.toString(),
      change: `${totalMerchants} total`,
      changeType: 'positive' as const,
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
        <Button variant="outline" size="sm" onClick={handleRefreshAll} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
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

      {/* Upcoming Merchants Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Merchant Management</h3>
        <UpcomingMerchants />
      </div>

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
              {bookings.slice(0, 3).map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{booking.student?.full_name || 'Unknown Student'}</p>
                    <p className="text-sm text-gray-500">{booking.study_hall?.name || 'Unknown Hall'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{booking.final_amount}</p>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-center text-gray-500 py-4">No recent bookings</p>
              )}
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
                { service: "Database", status: "operational", uptime: "99.9%" },
                { service: "Authentication", status: "operational", uptime: "100%" },
                { service: "Payment Gateway", status: "operational", uptime: "97.2%" },
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
