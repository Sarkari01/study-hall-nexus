
import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  errorCount: number;
  interactionDelay: number;
  fps: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  metric: keyof PerformanceMetrics;
  value: number;
  threshold: number;
  timestamp: string;
  message: string;
}

interface PerformanceThresholds {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  errorCount: number;
  interactionDelay: number;
  fps: number;
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  loadTime: 3000,      // 3 seconds
  renderTime: 100,     // 100ms
  memoryUsage: 50,     // 50MB
  networkLatency: 1000, // 1 second
  errorCount: 5,       // 5 errors per minute
  interactionDelay: 100, // 100ms
  fps: 30              // 30 FPS
};

export const usePerformanceMonitor = (thresholds: Partial<PerformanceThresholds> = {}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const alertIdRef = useRef(0);
  const performanceEntries = useRef<PerformanceEntry[]>([]);
  const errorCount = useRef(0);
  const finalThresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };

  const generateAlert = useCallback((
    type: PerformanceAlert['type'],
    metric: keyof PerformanceMetrics,
    value: number,
    threshold: number
  ) => {
    const alert: PerformanceAlert = {
      id: `alert_${++alertIdRef.current}`,
      type,
      metric,
      value,
      threshold,
      timestamp: new Date().toISOString(),
      message: `${metric} (${value}) exceeded threshold (${threshold})`
    };

    setAlerts(prev => [alert, ...prev.slice(0, 49)]); // Keep last 50 alerts
    
    console.warn(`Performance Alert [${type.toUpperCase()}]:`, alert.message);
  }, []);

  const measureLoadTime = useCallback((): number => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      return navigation.loadEventEnd - navigation.fetchStart;
    }
    return 0;
  }, []);

  const measureRenderTime = useCallback((): number => {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }, []);

  const measureMemoryUsage = useCallback((): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }
    return 0;
  }, []);

  const measureNetworkLatency = useCallback(async (): Promise<number> => {
    const start = performance.now();
    try {
      // Simple connectivity test
      await fetch('/ping', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      return performance.now() - start;
    } catch {
      return 0;
    }
  }, []);

  const measureFPS = useCallback((): Promise<number> => {
    return new Promise((resolve) => {
      let frameCount = 0;
      const startTime = performance.now();
      
      const countFrame = () => {
        frameCount++;
        const elapsed = performance.now() - startTime;
        
        if (elapsed >= 1000) { // Measure for 1 second
          resolve(Math.round(frameCount * 1000 / elapsed));
        } else {
          requestAnimationFrame(countFrame);
        }
      };
      
      requestAnimationFrame(countFrame);
    });
  }, []);

  const collectMetrics = useCallback(async () => {
    try {
      const loadTime = measureLoadTime();
      const renderTime = measureRenderTime();
      const memoryUsage = measureMemoryUsage();
      const networkLatency = await measureNetworkLatency();
      const fps = await measureFPS();
      
      const newMetrics: PerformanceMetrics = {
        loadTime,
        renderTime,
        memoryUsage,
        networkLatency,
        errorCount: errorCount.current,
        interactionDelay: 0, // Would need more sophisticated measurement
        fps
      };

      setMetrics(newMetrics);

      // Check thresholds and generate alerts
      Object.entries(newMetrics).forEach(([key, value]) => {
        const metricKey = key as keyof PerformanceMetrics;
        const threshold = finalThresholds[metricKey];
        
        if (value > threshold) {
          const alertType = value > threshold * 2 ? 'critical' : value > threshold * 1.5 ? 'error' : 'warning';
          generateAlert(alertType, metricKey, value, threshold);
        }
      });

    } catch (error) {
      console.error('Failed to collect performance metrics:', error);
    }
  }, [measureLoadTime, measureRenderTime, measureMemoryUsage, measureNetworkLatency, measureFPS, finalThresholds, generateAlert]);

  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);
    
    // Initial collection
    collectMetrics();
    
    // Set up periodic collection
    const interval = setInterval(collectMetrics, 10000); // Every 10 seconds
    
    // Set up error monitoring
    const errorHandler = (event: ErrorEvent) => {
      errorCount.current++;
      console.error('Performance Monitor - Error detected:', event.error);
    };
    
    window.addEventListener('error', errorHandler);
    
    // Set up performance observer for detailed metrics
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        performanceEntries.current.push(...list.getEntries());
      });
      
      try {
        observer.observe({ entryTypes: ['measure', 'navigation', 'resource', 'paint'] });
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('error', errorHandler);
      setIsMonitoring(false);
    };
  }, [isMonitoring, collectMetrics]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const getPerformanceScore = useCallback((): number => {
    if (!metrics) return 0;
    
    let score = 100;
    
    // Deduct points based on threshold violations
    Object.entries(metrics).forEach(([key, value]) => {
      const metricKey = key as keyof PerformanceMetrics;
      const threshold = finalThresholds[metricKey];
      
      if (value > threshold) {
        const violation = (value - threshold) / threshold;
        score -= Math.min(20, violation * 10); // Max 20 points per metric
      }
    });
    
    return Math.max(0, Math.round(score));
  }, [metrics, finalThresholds]);

  const getPerformanceSummary = useCallback(() => {
    if (!metrics) return null;
    
    const score = getPerformanceScore();
    const criticalAlerts = alerts.filter(alert => alert.type === 'critical').length;
    const warningAlerts = alerts.filter(alert => alert.type === 'warning').length;
    
    return {
      score,
      grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
      criticalIssues: criticalAlerts,
      warnings: warningAlerts,
      recommendations: [
        ...(metrics.loadTime > finalThresholds.loadTime ? ['Optimize page load times'] : []),
        ...(metrics.memoryUsage > finalThresholds.memoryUsage ? ['Reduce memory usage'] : []),
        ...(metrics.networkLatency > finalThresholds.networkLatency ? ['Improve network performance'] : []),
        ...(metrics.fps < finalThresholds.fps ? ['Optimize rendering performance'] : [])
      ]
    };
  }, [metrics, alerts, getPerformanceScore, finalThresholds]);

  useEffect(() => {
    const cleanup = startMonitoring();
    return cleanup;
  }, [startMonitoring]);

  return {
    metrics,
    alerts,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearAlerts,
    collectMetrics,
    getPerformanceScore,
    getPerformanceSummary,
    performanceEntries: performanceEntries.current
  };
};
