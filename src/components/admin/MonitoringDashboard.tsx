
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  Zap
} from 'lucide-react';
import SystemHealthDashboard from './SystemHealthDashboard';
import PerformanceMonitor from './PerformanceMonitor';
import OptimizationRecommendations from './OptimizationRecommendations';

const MonitoringDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('health');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            System Monitoring & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-gray-500">System Uptime</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold">85</div>
              <div className="text-sm text-gray-500">Performance Score</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <div className="text-2xl font-bold">6</div>
              <div className="text-sm text-gray-500">Active Optimizations</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Settings className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold">
                <Badge variant="secondary">Healthy</Badge>
              </div>
              <div className="text-sm text-gray-500">Overall Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-6">
          <SystemHealthDashboard />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceMonitor />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <OptimizationRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;
