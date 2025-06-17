
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  HardDrive, 
  Monitor,
  RefreshCw,
  TrendingUp,
  Wifi,
  Zap
} from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

const PerformanceMonitor: React.FC = () => {
  const {
    metrics,
    alerts,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearAlerts,
    collectMetrics,
    getPerformanceScore,
    getPerformanceSummary
  } = usePerformanceMonitor();

  const performanceSummary = getPerformanceSummary();
  const performanceScore = getPerformanceScore();

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'loadTime': return <Clock className="h-4 w-4" />;
      case 'renderTime': return <Monitor className="h-4 w-4" />;
      case 'memoryUsage': return <HardDrive className="h-4 w-4" />;
      case 'networkLatency': return <Wifi className="h-4 w-4" />;
      case 'errorCount': return <AlertTriangle className="h-4 w-4" />;
      case 'fps': return <Activity className="h-4 w-4" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  const formatMetricValue = (metric: string, value: number) => {
    switch (metric) {
      case 'loadTime':
      case 'renderTime':
      case 'networkLatency':
      case 'interactionDelay':
        return `${Math.round(value)}ms`;
      case 'memoryUsage':
        return `${value.toFixed(1)}MB`;
      case 'fps':
        return `${Math.round(value)} FPS`;
      case 'errorCount':
        return `${value} errors`;
      default:
        return `${value}`;
    }
  };

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Performance monitoring is initializing...</p>
            <Button onClick={collectMetrics} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Collect Metrics
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold">{performanceScore}</span>
              <Badge variant={performanceScore >= 80 ? 'default' : performanceScore >= 60 ? 'secondary' : 'destructive'}>
                {performanceSummary?.grade}
              </Badge>
            </div>
            <Progress value={performanceScore} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">
              {performanceScore >= 90 ? 'Excellent' : 
               performanceScore >= 80 ? 'Good' : 
               performanceScore >= 70 ? 'Fair' : 
               performanceScore >= 60 ? 'Poor' : 'Critical'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {alerts.filter(a => a.type === 'critical').length}
                  </div>
                  <div className="text-xs text-gray-500">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {alerts.filter(a => a.type === 'warning').length}
                  </div>
                  <div className="text-xs text-gray-500">Warnings</div>
                </div>
              </div>
              <Button onClick={clearAlerts} variant="outline" size="sm">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Monitoring Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isMonitoring ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <span className="font-medium">
                  {isMonitoring ? 'Active' : 'Stopped'}
                </span>
              </div>
              <Button 
                onClick={isMonitoring ? stopMonitoring : startMonitoring}
                variant={isMonitoring ? 'destructive' : 'default'}
                size="sm"
              >
                {isMonitoring ? 'Stop' : 'Start'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(metrics).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getMetricIcon(key)}
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className="text-lg font-bold">
                  {formatMetricValue(key, value)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Alerts</span>
              <Button onClick={clearAlerts} variant="outline" size="sm">
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {alerts.slice(0, 20).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={getAlertColor(alert.type) as any}>
                        {alert.type}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {getMetricIcon(alert.metric)}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Performance Recommendations */}
      {performanceSummary?.recommendations && performanceSummary.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {performanceSummary.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceMonitor;
