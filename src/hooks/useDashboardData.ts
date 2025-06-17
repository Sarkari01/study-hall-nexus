
import { useState, useEffect, useCallback } from 'react';
import { useDashboardStats } from './useDashboardStats';
import { useDashboardCharts } from './useDashboardCharts';
import { useRecentActivities } from './useRecentActivities';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  const [globalLoading, setGlobalLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { toast } = useToast();

  const statsQuery = useDashboardStats();
  const chartsQuery = useDashboardCharts();
  const activitiesQuery = useRecentActivities();

  const isLoading = statsQuery.loading || chartsQuery.loading || activitiesQuery.loading;
  const hasError = statsQuery.error || chartsQuery.error;

  const refreshAll = useCallback(async () => {
    try {
      setGlobalLoading(true);
      
      await Promise.allSettled([
        statsQuery.refetch(),
        chartsQuery.refetch(),
        activitiesQuery.refetch()
      ]);

      setLastRefresh(new Date());
      
      toast({
        title: "Dashboard Updated",
        description: "All dashboard data has been refreshed successfully.",
      });
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast({
        title: "Refresh Failed",
        description: "Some dashboard data could not be refreshed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGlobalLoading(false);
    }
  }, [statsQuery.refetch, chartsQuery.refetch, activitiesQuery.refetch, toast]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        refreshAll();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshAll, isLoading]);

  // Real-time subscriptions
  useEffect(() => {
    const bookingsChannel = supabase
      .channel('dashboard-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        statsQuery.refetch();
        chartsQuery.refetch();
        activitiesQuery.refetch();
      })
      .subscribe();

    const studentsChannel = supabase
      .channel('dashboard-students')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        statsQuery.refetch();
      })
      .subscribe();

    const merchantsChannel = supabase
      .channel('dashboard-merchants')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'merchant_profiles' }, () => {
        statsQuery.refetch();
        activitiesQuery.refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(studentsChannel);
      supabase.removeChannel(merchantsChannel);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setGlobalLoading(false);
    }
  }, [isLoading]);

  return {
    stats: statsQuery.stats,
    charts: chartsQuery.chartData,
    activities: activitiesQuery.activities,
    loading: globalLoading || isLoading,
    error: hasError,
    lastRefresh,
    refreshAll,
    refreshStats: statsQuery.refetch,
    refreshCharts: chartsQuery.refetch,
    refreshActivities: activitiesQuery.refetch,
  };
};
