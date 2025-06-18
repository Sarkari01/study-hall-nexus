
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Users, Building2, Calendar } from "lucide-react";
import { useDashboardData } from '@/hooks/useDashboardData';
import InteractiveDashboard from './InteractiveDashboard';
import ErrorBoundary from "./ErrorBoundary";

interface DashboardOverviewProps {
  onNavigate?: (route: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { 
    error, 
    refreshAll 
  } = useDashboardData();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (error) {
    return (
      <Card className="border-emerald-200 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4 lg:p-6">
          <div className="text-center">
            <h3 className="text-base lg:text-lg font-medium text-emerald-900 mb-2">Dashboard Error</h3>
            <p className="text-emerald-600 mb-4 text-sm lg:text-base">Unable to load dashboard data. Please try refreshing.</p>
            <Button onClick={refreshAll} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm lg:text-base">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <ErrorBoundary>
      <div className="space-y-4 lg:space-y-6 w-full">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg p-4 lg:p-6 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl lg:text-3xl font-bold mb-2">{getGreeting()}</h1>
              <p className="text-emerald-100 text-sm lg:text-base">Monitor and manage your platform efficiently</p>
            </div>
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
              <div className="text-center">
                <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-1" />
                <p className="text-xs">Growing</p>
              </div>
              <div className="text-center">
                <Users className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-1" />
                <p className="text-xs">Active Users</p>
              </div>
              <div className="text-center">
                <Building2 className="h-6 w-6 lg:h-8 lg:w-8 mx-auto mb-1" />
                <p className="text-xs">Study Halls</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <InteractiveDashboard onNavigate={onNavigate} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardOverview;
