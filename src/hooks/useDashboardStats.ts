
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalStudents: number;
  totalMerchants: number;
  totalBookings: number;
  totalRevenue: number;
  activeStudents: number;
  activeStudyHalls: number;
  pendingBookings: number;
  completedBookings: number;
}

const defaultStats: DashboardStats = {
  totalStudents: 0,
  totalMerchants: 0,
  totalBookings: 0,
  totalRevenue: 0,
  activeStudents: 0,
  activeStudyHalls: 0,
  pendingBookings: 0,
  completedBookings: 0,
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize stats with defaults
      let calculatedStats = { ...defaultStats };

      try {
        // Fetch students data with error handling
        const { data: students, error: studentsError } = await supabase
          .from('students')
          .select('status, total_spent');

        if (studentsError) {
          console.warn('Students fetch error:', studentsError);
        } else if (students) {
          calculatedStats.totalStudents = students.length;
          calculatedStats.activeStudents = students.filter(s => s.status === 'active').length;
        }
      } catch (error) {
        console.warn('Error fetching students:', error);
      }

      try {
        // Fetch study halls data with error handling
        const { data: studyHalls, error: studyHallsError } = await supabase
          .from('study_halls')
          .select('status, total_revenue');

        if (studyHallsError) {
          console.warn('Study halls fetch error:', studyHallsError);
        } else if (studyHalls) {
          calculatedStats.activeStudyHalls = studyHalls.filter(h => h.status === 'active').length;
        }
      } catch (error) {
        console.warn('Error fetching study halls:', error);
      }

      try {
        // Fetch bookings data with error handling
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('status, final_amount');

        if (bookingsError) {
          console.warn('Bookings fetch error:', bookingsError);
        } else if (bookings) {
          calculatedStats.totalBookings = bookings.length;
          calculatedStats.pendingBookings = bookings.filter(b => b.status === 'pending').length;
          calculatedStats.completedBookings = bookings.filter(b => b.status === 'completed').length;
          calculatedStats.totalRevenue = bookings.reduce((sum, booking) => sum + (booking.final_amount || 0), 0);
        }
      } catch (error) {
        console.warn('Error fetching bookings:', error);
      }

      try {
        // Fetch merchant profiles data with error handling
        const { data: merchants, error: merchantsError } = await supabase
          .from('merchant_profiles')
          .select('approval_status');

        if (merchantsError) {
          console.warn('Merchants fetch error:', merchantsError);
        } else if (merchants) {
          calculatedStats.totalMerchants = merchants.length;
        }
      } catch (error) {
        console.warn('Error fetching merchants:', error);
      }

      setStats(calculatedStats);
      console.log('Dashboard stats loaded successfully:', calculatedStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to fetch dashboard statistics');
      toast({
        title: "Warning",
        description: "Some dashboard statistics could not be loaded. Using default values.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
