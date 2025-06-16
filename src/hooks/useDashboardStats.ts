
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalStudents: number;
  activeStudyHalls: number;
  totalBookings: number;
  totalRevenue: number;
  studentsChange: number;
  studyHallsChange: number;
  bookingsChange: number;
  revenueChange: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudyHalls: 0,
    totalBookings: 0,
    totalRevenue: 0,
    studentsChange: 0,
    studyHallsChange: 0,
    bookingsChange: 0,
    revenueChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch students data
      const { data: studentsData } = await supabase
        .from('students')
        .select('status, total_spent');

      // Fetch study halls data
      const { data: studyHallsData } = await supabase
        .from('study_halls')
        .select('status, total_revenue');

      // Fetch bookings data
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('status, final_amount');

      // Fetch merchant profiles data
      const { data: merchantsData } = await supabase
        .from('merchant_profiles')
        .select('approval_status');

      // Calculate stats
      const totalStudents = studentsData?.filter(s => s.status === 'active').length || 0;
      const activeStudyHalls = studyHallsData?.filter(h => h.status === 'active').length || 0;
      const totalBookings = bookingsData?.length || 0;
      const totalRevenue = studyHallsData?.reduce((sum, hall) => sum + (hall.total_revenue || 0), 0) || 0;

      // For now, we'll use mock percentage changes since we don't have historical data
      const studentsChange = Math.floor(Math.random() * 20) - 5; // Random between -5 and 15
      const studyHallsChange = Math.floor(Math.random() * 15) - 2; // Random between -2 and 13
      const bookingsChange = Math.floor(Math.random() * 25) - 5; // Random between -5 and 20
      const revenueChange = Math.floor(Math.random() * 30) - 10; // Random between -10 and 20

      setStats({
        totalStudents,
        activeStudyHalls,
        totalBookings,
        totalRevenue,
        studentsChange,
        studyHallsChange,
        bookingsChange,
        revenueChange
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to fetch dashboard statistics');
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch
  };
};
