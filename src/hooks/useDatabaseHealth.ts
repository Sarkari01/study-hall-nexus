
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DatabaseHealthMetrics {
  connectionStatus: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  activeConnections: number;
  tableCount: number;
  lastBackup: string | null;
  storageUsed: number;
  errorRate: number;
  uptime: string;
}

interface HealthCheck {
  timestamp: string;
  status: 'pass' | 'fail';
  responseTime: number;
  error?: string;
}

export const useDatabaseHealth = () => {
  const [metrics, setMetrics] = useState<DatabaseHealthMetrics | null>(null);
  const [healthHistory, setHealthHistory] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [monitoring, setMonitoring] = useState(false);
  const { toast } = useToast();

  const performHealthCheck = useCallback(async (): Promise<HealthCheck> => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      // Test basic connectivity
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count(*)')
        .limit(1);

      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          timestamp,
          status: 'fail',
          responseTime,
          error: error.message
        };
      }

      return {
        timestamp,
        status: 'pass',
        responseTime
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      return {
        timestamp,
        status: 'fail',
        responseTime,
        error: error.message
      };
    }
  }, []);

  const fetchDatabaseMetrics = useCallback(async () => {
    try {
      setLoading(true);

      // Perform health check
      const healthCheck = await performHealthCheck();
      
      // Update health history
      setHealthHistory(prev => [healthCheck, ...prev.slice(0, 99)]); // Keep last 100 checks

      // Calculate metrics
      const recentChecks = healthHistory.slice(0, 10);
      const errorRate = recentChecks.length > 0 
        ? (recentChecks.filter(check => check.status === 'fail').length / recentChecks.length) * 100
        : 0;

      const averageResponseTime = recentChecks.length > 0
        ? recentChecks.reduce((sum, check) => sum + check.responseTime, 0) / recentChecks.length
        : healthCheck.responseTime;

      // Determine overall health status
      let connectionStatus: 'healthy' | 'degraded' | 'down' = 'healthy';
      if (healthCheck.status === 'fail') {
        connectionStatus = 'down';
      } else if (errorRate > 10 || averageResponseTime > 2000) {
        connectionStatus = 'degraded';
      }

      const newMetrics: DatabaseHealthMetrics = {
        connectionStatus,
        responseTime: averageResponseTime,
        activeConnections: 0, // This would need admin access to get real data
        tableCount: 0, // This would need admin access
        lastBackup: null, // This would need admin access
        storageUsed: 0, // This would need admin access
        errorRate,
        uptime: 'N/A' // This would need admin access
      };

      setMetrics(newMetrics);

      // Show toast for degraded or down status
      if (connectionStatus !== 'healthy') {
        toast({
          title: "Database Health Warning",
          description: `Database status is ${connectionStatus}`,
          variant: "destructive",
        });
      }

    } catch (error: any) {
      console.error('Failed to fetch database metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch database health metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [healthHistory, performHealthCheck, toast]);

  const startMonitoring = useCallback(() => {
    if (monitoring) return;
    
    setMonitoring(true);
    
    // Initial check
    fetchDatabaseMetrics();
    
    // Set up periodic monitoring
    const interval = setInterval(fetchDatabaseMetrics, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(interval);
      setMonitoring(false);
    };
  }, [monitoring, fetchDatabaseMetrics]);

  const stopMonitoring = useCallback(() => {
    setMonitoring(false);
  }, []);

  const getHealthSummary = useCallback(() => {
    if (!metrics) return null;

    const recentFailures = healthHistory.slice(0, 10).filter(check => check.status === 'fail').length;
    const isHealthy = metrics.connectionStatus === 'healthy';
    const isDegraded = metrics.connectionStatus === 'degraded';
    
    return {
      overall: isHealthy ? 'good' : isDegraded ? 'warning' : 'critical',
      issues: [
        ...(recentFailures > 0 ? [`${recentFailures} recent failures`] : []),
        ...(metrics.responseTime > 1000 ? ['Slow response times'] : []),
        ...(metrics.errorRate > 5 ? [`${metrics.errorRate.toFixed(1)}% error rate`] : [])
      ],
      recommendations: [
        ...(metrics.responseTime > 1000 ? ['Consider optimizing queries'] : []),
        ...(metrics.errorRate > 10 ? ['Check database connection stability'] : []),
        ...(recentFailures > 3 ? ['Review recent database changes'] : [])
      ]
    };
  }, [metrics, healthHistory]);

  useEffect(() => {
    // Start monitoring on mount
    const cleanup = startMonitoring();
    
    return cleanup;
  }, [startMonitoring]);

  return {
    metrics,
    healthHistory: healthHistory.slice(0, 20), // Return last 20 checks
    loading,
    monitoring,
    startMonitoring,
    stopMonitoring,
    performHealthCheck,
    refreshMetrics: fetchDatabaseMetrics,
    getHealthSummary
  };
};
