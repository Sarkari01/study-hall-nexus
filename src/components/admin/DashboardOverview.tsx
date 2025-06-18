
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

  if (error) {
    return (
      <Card className="border-emerald-200 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-emerald-900 mb-2">Dashboard Error</h3>
            <p className="text-emerald-600 mb-4">Unable to load dashboard data. Please try refreshing.</p>
            <Button onClick={refreshAll} className="bg-emerald-600 hover:bg-emerald-700 text-white">
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
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
              <p className="text-emerald-100">Monitor and manage your platform efficiently</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-1" />
                <p className="text-xs">Growing</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-1" />
                <p className="text-xs">Active Users</p>
              </div>
              <div className="text-center">
                <Building2 className="h-8 w-8 mx-auto mb-1" />
                <p className="text-xs">Study Halls</p>
              </div>
            </div>
          </div>
        </div>

        <InteractiveDashboard onNavigate={onNavigate} />
      </div>
    </ErrorBoundary>
  );
};

export default DashboardOverview;
