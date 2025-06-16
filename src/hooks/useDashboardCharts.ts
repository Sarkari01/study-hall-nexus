
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChartData {
  bookingsChart: Array<{ name: string; bookings: number; revenue: number }>;
  studyHallsChart: Array<{ name: string; halls: number; revenue: number }>;
  revenueChart: Array<{ month: string; revenue: number }>;
  userGrowthChart: Array<{ month: string; students: number; merchants: number }>;
}

const defaultChartData: ChartData = {
  bookingsChart: [],
  studyHallsChart: [],
  revenueChart: [],
  userGrowthChart: [],
};

export const useDashboardCharts = () => {
  const [chartData, setChartData] = useState<ChartData>(defaultChartData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize with default data
      let calculatedData = { ...defaultChartData };

      try {
        // Fetch bookings data for charts
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('created_at, final_amount, status');

        if (bookingsError) {
          console.warn('Bookings chart fetch error:', bookingsError);
        } else if (bookings) {
          // Process bookings data for charts
          const monthlyBookings = bookings.reduce((acc: any, booking) => {
            const month = new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!acc[month]) {
              acc[month] = { bookings: 0, revenue: 0 };
            }
            acc[month].bookings += 1;
            acc[month].revenue += Number(booking.final_amount) || 0;
            return acc;
          }, {});

          calculatedData.bookingsChart = Object.entries(monthlyBookings).map(([name, data]: [string, any]) => ({
            name,
            bookings: data.bookings,
            revenue: data.revenue,
          }));

          calculatedData.revenueChart = Object.entries(monthlyBookings).map(([month, data]: [string, any]) => ({
            month,
            revenue: data.revenue,
          }));
        }
      } catch (error) {
        console.warn('Error processing bookings chart data:', error);
      }

      try {
        // Fetch study halls data for charts
        const { data: studyHalls, error: studyHallsError } = await supabase
          .from('study_halls')
          .select('created_at, total_revenue, status');

        if (studyHallsError) {
          console.warn('Study halls chart fetch error:', studyHallsError);
        } else if (studyHalls) {
          const monthlyHalls = studyHalls.reduce((acc: any, hall) => {
            const month = new Date(hall.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!acc[month]) {
              acc[month] = { halls: 0, revenue: 0 };
            }
            acc[month].halls += 1;
            acc[month].revenue += Number(hall.total_revenue) || 0;
            return acc;
          }, {});

          calculatedData.studyHallsChart = Object.entries(monthlyHalls).map(([name, data]: [string, any]) => ({
            name,
            halls: data.halls,
            revenue: data.revenue,
          }));
        }
      } catch (error) {
        console.warn('Error processing study halls chart data:', error);
      }

      try {
        // Fetch user growth data
        const { data: students, error: studentsError } = await supabase
          .from('students')
          .select('created_at');

        const { data: merchants, error: merchantsError } = await supabase
          .from('merchant_profiles')
          .select('created_at');

        if (studentsError) {
          console.warn('Students growth chart fetch error:', studentsError);
        }
        
        if (merchantsError) {
          console.warn('Merchants growth chart fetch error:', merchantsError);
        }

        if (students || merchants) {
          const monthlyUsers: any = {};

          // Process students
          students?.forEach(student => {
            const month = new Date(student.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!monthlyUsers[month]) {
              monthlyUsers[month] = { students: 0, merchants: 0 };
            }
            monthlyUsers[month].students += 1;
          });

          // Process merchants
          merchants?.forEach(merchant => {
            const month = new Date(merchant.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!monthlyUsers[month]) {
              monthlyUsers[month] = { students: 0, merchants: 0 };
            }
            monthlyUsers[month].merchants += 1;
          });

          calculatedData.userGrowthChart = Object.entries(monthlyUsers).map(([month, data]: [string, any]) => ({
            month,
            students: data.students,
            merchants: data.merchants,
          }));
        }
      } catch (error) {
        console.warn('Error processing user growth chart data:', error);
      }

      setChartData(calculatedData);
      console.log('Dashboard charts loaded successfully:', calculatedData);
    } catch (error) {
      console.error('Error fetching dashboard charts:', error);
      setError('Failed to fetch dashboard charts');
      toast({
        title: "Warning",
        description: "Some dashboard charts could not be loaded. Using default values.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return {
    chartData,
    loading,
    error,
    refetch: fetchChartData,
  };
};
