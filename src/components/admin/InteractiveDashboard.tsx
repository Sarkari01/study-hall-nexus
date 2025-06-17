
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Users, Building2, Download, Settings, Activity } from 'lucide-react';
import DashboardMetrics from './DashboardMetrics';
import DashboardCharts from './DashboardCharts';
import ActivityFeed from './ActivityFeed';
import QuickActionPanel from './QuickActionPanel';
import DashboardAlerts from './DashboardAlerts';
import EnhancedDashboardHeader from './EnhancedDashboardHeader';
import MonitoringDashboard from './MonitoringDashboard';
import { useDashboardData } from '@/hooks/useDashboardData';

interface InteractiveDashboardProps {
  onNavigate?: (route: string) => void;
}

const InteractiveDashboard: React.FC<InteractiveDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchValue, setSearchValue] = useState('');
  
  const { 
    stats, 
    charts, 
    activities, 
    loading, 
    error, 
    refreshAll 
  } = useDashboardData();

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      console.log(`Navigate to: ${route}`);
    }
  };

  return (
    <div className="space-y-6">
      <EnhancedDashboardHeader 
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        notifications={5}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="merchants" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Merchants
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <DashboardMetrics stats={stats} loading={loading} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCharts />
            <ActivityFeed activities={activities} loading={loading} />
          </div>

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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <DashboardCharts />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardMetrics stats={stats} loading={loading} />
            <ActivityFeed activities={activities} loading={loading} />
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600 mb-4">Detailed user analytics and management tools</p>
            <Button onClick={() => handleNavigate('students')}>
              Go to Users
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="merchants" className="space-y-6">
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Merchant Management</h3>
            <p className="text-gray-600 mb-4">Manage merchant applications and profiles</p>
            <Button onClick={() => handleNavigate('merchants')}>
              Go to Merchants
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <MonitoringDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveDashboard;
