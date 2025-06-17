
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Database, 
  Globe, 
  HardDrive, 
  RefreshCw, 
  Server,
  Wifi,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PerformanceMonitor from './PerformanceMonitor';

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  unit: string;
  threshold: number;
  icon: React.ReactNode;
}

const SystemHealthDashboard: React.FC = () => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const checkDatabaseHealth = async (): Promise<HealthMetric> => {
    try {
      const start = performance.now();
      const { error } = await supabase.from('students').select('count', { count: 'exact', head: true });
      const responseTime = performance.now() - start;
      
      return {
        name: 'Database',
        status: error ? 'critical' : responseTime > 1000 ? 'warning' : 'healthy',
        value: responseTime,
        unit: 'ms',
        threshold: 1000,
        icon: <Database className="h-4 w-4" />
      };
    } catch (error) {
      return {
        name: 'Database',
        status: 'critical',
        value: 0,
        unit: 'ms',
        threshold: 1000,
        icon: <Database className="h-4 w-4" />
      };
    }
  };

  const checkApiHealth = async (): Promise<HealthMetric> => {
    try {
      const start = performance.now();
      const response = await fetch('/api/health', { method: 'HEAD' }).catch(() => null);
      const responseTime = performance.now() - start;
      
      return {
        name: 'API Response',
        status: !response ? 'critical' : responseTime > 500 ? 'warning' : 'healthy',
        value: responseTime,
        unit: 'ms',
        threshold: 500,
        icon: <Server className="h-4 w-4" />
      };
    } catch (error) {
      return {
        name: 'API Response',
        status: 'critical',
        value: 0,
        unit: 'ms',
        threshold: 500,
        icon: <Server className="h-4 w-4" />
      };
    }
  };

  const checkMemoryUsage = (): HealthMetric => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / (1024 * 1024);
      
      return {
        name: 'Memory Usage',
        status: usedMB > 100 ? 'critical' : usedMB > 50 ? 'warning' : 'healthy',
        value: usedMB,
        unit: 'MB',
        threshold: 50,
        icon: <HardDrive className="h-4 w-4" />
      };
    }
    
    return {
      name: 'Memory Usage',
      status: 'healthy',
      value: 0,
      unit: 'MB',
      threshold: 50,
      icon: <HardDrive className="h-4 w-4" />
    };
  };

  const checkNetworkConnectivity = async (): Promise<HealthMetric> => {
    try {
      const start = performance.now();
      await fetch('https://www.google.com/favicon.ico', { 
        mode: 'no-cors',
        cache: 'no-cache'
      });
      const latency = performance.now() - start;
      
      return {
        name: 'Network',
        status: latency > 2000 ? 'warning' : 'healthy',
        value: latency,
        unit: 'ms',
        threshold: 2000,
        icon: <Wifi className="h-4 w-4" />
      };
    } catch (error) {
      return {
        name: 'Network',
        status: 'critical',
        value: 0,
        unit: 'ms',
        threshold: 2000,
        icon: <Wifi className="h-4 w-4" />
      };
    }
  };

  const collectHealthMetrics = async () => {
    setIsLoading(true);
    try {
      const [database, api, memory, network] = await Promise.all([
        checkDatabaseHealth(),
        checkApiHealth(),
        Promise.resolve(checkMemoryUsage()),
        checkNetworkConnectivity()
      ]);

      setHealthMetrics([database, api, memory, network]);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to collect health metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    collectHealthMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(collectHealthMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const overallHealth = healthMetrics.length > 0 ? 
    healthMetrics.some(m => m.status === 'critical') ? 'critical' :
    healthMetrics.some(m => m.status === 'warning') ? 'warning' : 'healthy' : 'healthy';

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              System Health Overview
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
              <Button onClick={collectHealthMetrics} variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(overallHealth)}
              <span className="font-medium capitalize">System Status: {overallHealth}</span>
            </div>
            <Badge className={getStatusColor(overallHealth)}>
              {healthMetrics.filter(m => m.status === 'healthy').length}/{healthMetrics.length} Healthy
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {metric.icon}
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  {getStatusIcon(metric.status)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Value:</span>
                    <span className="font-medium">
                      {metric.value.toFixed(1)} {metric.unit}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((metric.value / metric.threshold) * 100, 100)} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    Threshold: {metric.threshold} {metric.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Monitoring Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <PerformanceMonitor />
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthMetrics.filter(m => m.name === 'Memory Usage').map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span>Current Usage</span>
                        <span className="font-medium">{metric.value.toFixed(1)} {metric.unit}</span>
                      </div>
                      <Progress value={(metric.value / 200) * 100} className="h-3" />
                      <p className="text-xs text-gray-500 mt-1">
                        Status: <span className={`font-medium ${metric.status === 'healthy' ? 'text-green-600' : metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                          {metric.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Resource Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Advanced resource monitoring</p>
                    <p className="text-sm text-gray-500">CPU, Disk I/O, and other metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="connectivity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Connection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthMetrics.filter(m => m.name === 'Database').map((metric, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span>Response Time</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(metric.status)}
                          <span className="font-medium">{metric.value.toFixed(0)} {metric.unit}</span>
                        </div>
                      </div>
                      <Progress value={Math.min((metric.value / metric.threshold) * 100, 100)} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Network Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthMetrics.filter(m => m.name === 'Network').map((metric, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span>Latency</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(metric.status)}
                          <span className="font-medium">{metric.value.toFixed(0)} {metric.unit}</span>
                        </div>
                      </div>
                      <Progress value={Math.min((metric.value / metric.threshold) * 100, 100)} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealthDashboard;
