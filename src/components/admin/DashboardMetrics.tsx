
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Building2, AlertCircle, CheckCircle } from "lucide-react";

interface MetricData {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  target?: number;
  current?: number;
}

interface DashboardMetricsProps {
  stats: any;
  loading?: boolean;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ stats, loading }) => {
  const metrics: MetricData[] = [
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      change: 12.5,
      trend: 'up',
      icon: <DollarSign className="h-5 w-5" />,
      target: 100000,
      current: stats?.totalRevenue || 0,
    },
    {
      title: "Active Students",
      value: stats?.activeStudents || 0,
      change: 8.2,
      trend: 'up',
      icon: <Users className="h-5 w-5" />,
      target: 1000,
      current: stats?.activeStudents || 0,
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      change: -2.1,
      trend: 'down',
      icon: <Calendar className="h-5 w-5" />,
      target: 500,
      current: stats?.totalBookings || 0,
    },
    {
      title: "Active Study Halls",
      value: stats?.activeStudyHalls || 0,
      change: 5.7,
      trend: 'up',
      icon: <Building2 className="h-5 w-5" />,
      target: 50,
      current: stats?.activeStudyHalls || 0,
    },
    {
      title: "Pending Bookings",
      value: stats?.pendingBookings || 0,
      change: 0,
      trend: 'neutral',
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      title: "Completed Bookings",
      value: stats?.completedBookings || 0,
      change: 15.3,
      trend: 'up',
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3" />;
      case 'down': return <TrendingDown className="h-3 w-3" />;
      default: return null;
    }
  };

  const getIconBgColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-emerald-100 text-emerald-600', 
      'bg-purple-100 text-purple-600',
      'bg-orange-100 text-orange-600',
      'bg-cyan-100 text-cyan-600',
      'bg-pink-100 text-pink-600'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-emerald-200">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-emerald-100 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-emerald-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-emerald-100 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-200 border-emerald-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${getIconBgColor(index)}`}>
              {metric.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-emerald-900">
                  {metric.value}
                </span>
                {metric.change !== 0 && (
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${getTrendColor(metric.trend)} border-current`}
                  >
                    {getTrendIcon(metric.trend)}
                    {Math.abs(metric.change)}%
                  </Badge>
                )}
              </div>
              
              {metric.target && metric.current !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-emerald-600">
                    <span>Target: {metric.target.toLocaleString()}</span>
                    <span>{Math.round((metric.current / metric.target) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(metric.current / metric.target) * 100} 
                    className="h-2 bg-emerald-100"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
