
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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
      <InteractiveDashboard onNavigate={onNavigate} />
    </ErrorBoundary>
  );
};

export default DashboardOverview;
