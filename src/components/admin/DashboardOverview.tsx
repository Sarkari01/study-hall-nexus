
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardMetrics from './DashboardMetrics';
import DashboardCharts from './DashboardCharts';
import DashboardAlerts from './DashboardAlerts';
import QuickActionPanel from './QuickActionPanel';
import ErrorBoundary from "./ErrorBoundary";

interface DashboardOverviewProps {
  onNavigate?: (route: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { 
    stats, 
    charts, 
    activities, 
    loading, 
    error, 
    lastRefresh, 
    refreshAll 
  } = useDashboardData();

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      console.log(`Navigate to: ${route}`);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Error</h3>
            <p className="text-gray-600 mb-4">Unable to load dashboard data. Please try refreshing.</p>
            <Button onClick={refreshAll}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-600">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshAll}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Metrics Section */}
        <DashboardMetrics stats={stats} loading={loading} />

        {/* Charts Section */}
        <DashboardCharts />

        {/* Action Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActionPanel 
            onNavigate={handleNavigate}
            pendingCounts={{
              merchants: stats?.totalMerchants || 0,
              bookings: stats?.pendingBookings || 0,
              students: stats?.totalStudents || 0,
            }}
          />
          <DashboardAlerts />
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activities found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities?.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {activity.amount && (
                      <div className="text-sm font-medium text-green-600">
                        ₹{activity.amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardOverview;
