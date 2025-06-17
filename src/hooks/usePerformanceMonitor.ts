
import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  errorCount: number;
  fps: number;
  interactionDelay: number;
}

interface PerformanceAlert {
  id: string;
  type: 'critical' | 'error' | 'warning' | 'info';
  message: string;
  metric: string;
  timestamp: number;
}

interface PerformanceSummary {
  grade: string;
  recommendations: string[];
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const collectMetrics = useCallback(() => {
    // Mock performance metrics for demo
    const mockMetrics: PerformanceMetrics = {
      loadTime: Math.random() * 2000 + 500,
      renderTime: Math.random() * 100 + 10,
      memoryUsage: Math.random() * 50 + 20,
      networkLatency: Math.random() * 200 + 50,
      errorCount: Math.floor(Math.random() * 5),
      fps: Math.random() * 20 + 40,
      interactionDelay: Math.random() * 50 + 10
    };

    setMetrics(mockMetrics);

    // Generate alerts based on metrics
    const newAlerts: PerformanceAlert[] = [];
    
    if (mockMetrics.loadTime > 1500) {
      newAlerts.push({
        id: Date.now().toString(),
        type: 'warning',
        message: 'Page load time is slower than expected',
        metric: 'loadTime',
        timestamp: Date.now()
      });
    }

    if (mockMetrics.memoryUsage > 60) {
      newAlerts.push({
        id: (Date.now() + 1).toString(),
        type: 'critical',
        message: 'Memory usage is critically high',
        metric: 'memoryUsage',
        timestamp: Date.now()
      });
    }

    setAlerts(prev => [...newAlerts, ...prev].slice(0, 20));
  }, []);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    collectMetrics();
  }, [collectMetrics]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const getPerformanceScore = useCallback((): number => {
    if (!metrics) return 0;
    
    const scores = {
      loadTime: Math.max(0, 100 - (metrics.loadTime / 20)),
      renderTime: Math.max(0, 100 - metrics.renderTime),
      memoryUsage: Math.max(0, 100 - metrics.memoryUsage),
      networkLatency: Math.max(0, 100 - (metrics.networkLatency / 2)),
      errorCount: Math.max(0, 100 - (metrics.errorCount * 20)),
      fps: Math.min(100, metrics.fps * 1.67)
    };

    return Math.round(Object.values(scores).reduce((a, b) => a + b) / Object.keys(scores).length);
  }, [metrics]);

  const getPerformanceSummary = useCallback((): PerformanceSummary => {
    const score = getPerformanceScore();
    let grade = 'F';
    let recommendations: string[] = [];

    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';

    if (metrics) {
      if (metrics.loadTime > 1000) {
        recommendations.push('Consider implementing lazy loading for components');
      }
      if (metrics.memoryUsage > 50) {
        recommendations.push('Optimize memory usage by implementing proper cleanup');
      }
      if (metrics.networkLatency > 150) {
        recommendations.push('Consider using a CDN or optimizing API calls');
      }
    }

    return { grade, recommendations };
  }, [metrics, getPerformanceScore]);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(collectMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, collectMetrics]);

  useEffect(() => {
    // Initialize with some metrics
    collectMetrics();
  }, [collectMetrics]);

  return {
    metrics,
    alerts,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearAlerts,
    collectMetrics,
    getPerformanceScore,
    getPerformanceSummary
  };
};
