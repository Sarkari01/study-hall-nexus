
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

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalMerchants: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeStudents: 0,
    activeStudyHalls: 0,
    pendingBookings: 0,
    completedBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch students data
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('status, total_spent');

      if (studentsError) throw studentsError;

      // Fetch study halls data
      const { data: studyHalls, error: studyHallsError } = await supabase
        .from('study_halls')
        .select('status, total_revenue');

      if (studyHallsError) throw studyHallsError;

      // Fetch bookings data
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('status, final_amount');

      if (bookingsError) throw bookingsError;

      // Fetch merchant profiles data
      const { data: merchants, error: merchantsError } = await supabase
        .from('merchant_profiles')
        .select('verification_status');

      if (merchantsError) throw merchantsError;

      // Calculate stats
      const totalStudents = students?.length || 0;
      const activeStudents = students?.filter(s => s.status === 'active').length || 0;
      const totalMerchants = merchants?.length || 0;
      const totalBookings = bookings?.length || 0;
      const activeStudyHalls = studyHalls?.filter(h => h.status === 'active').length || 0;
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;

      // Calculate total revenue from bookings
      const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.final_amount || 0), 0) || 0;

      setStats({
        totalStudents,
        totalMerchants,
        totalBookings,
        totalRevenue,
        activeStudents,
        activeStudyHalls,
        pendingBookings,
        completedBookings,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
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
    refetch: fetchStats,
  };
};
