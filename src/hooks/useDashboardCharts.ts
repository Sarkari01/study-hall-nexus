
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RevenueData {
  name: string;
  revenue: number;
  bookings: number;
  students: number;
}

interface MerchantPerformance {
  name: string;
  revenue: number;
  bookings: number;
  growth: number;
}

interface BookingDistribution {
  name: string;
  value: number;
  color: string;
}

interface StudentActivity {
  hour: string;
  active: number;
}

interface DashboardChartsData {
  revenueData: RevenueData[];
  merchantData: MerchantPerformance[];
  bookingDistribution: BookingDistribution[];
  studentActivityData: StudentActivity[];
}

export const useDashboardCharts = () => {
  const [chartsData, setChartsData] = useState<DashboardChartsData>({
    revenueData: [],
    merchantData: [],
    bookingDistribution: [],
    studentActivityData: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchChartsData = async () => {
    try {
      setLoading(true);

      // Fetch revenue data for the last 7 days
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('booking_date, final_amount, created_at')
        .gte('booking_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .eq('status', 'completed');

      if (bookingsError) throw bookingsError;

      // Process revenue data by day
      const revenueByDay = new Map();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dayName = days[date.getDay()];
        revenueByDay.set(dayName, {
          name: dayName,
          revenue: 0,
          bookings: 0,
          students: 0
        });
      }

      bookings?.forEach(booking => {
        const date = new Date(booking.booking_date);
        const dayName = days[date.getDay()];
        if (revenueByDay.has(dayName)) {
          const dayData = revenueByDay.get(dayName);
          dayData.revenue += Number(booking.final_amount);
          dayData.bookings += 1;
          dayData.students += 1; // Assuming one student per booking
        }
      });

      const revenueData = Array.from(revenueByDay.values());

      // Fetch merchant performance data
      const { data: merchants, error: merchantsError } = await supabase
        .from('merchant_profiles')
        .select(`
          full_name,
          business_name,
          study_halls (
            total_revenue,
            total_bookings
          )
        `)
        .limit(5);

      if (merchantsError) throw merchantsError;

      const merchantData = merchants?.map(merchant => ({
        name: merchant.business_name || merchant.full_name,
        revenue: merchant.study_halls?.reduce((sum, hall) => sum + (hall.total_revenue || 0), 0) || 0,
        bookings: merchant.study_halls?.reduce((sum, hall) => sum + (hall.total_bookings || 0), 0) || 0,
        growth: Math.random() * 30 // Mock growth for now
      })) || [];

      // Fetch booking distribution by time
      const { data: timeBookings, error: timeError } = await supabase
        .from('bookings')
        .select('start_time')
        .eq('status', 'completed');

      if (timeError) throw timeError;

      const timeDistribution = {
        morning: 0,
        afternoon: 0,
        evening: 0
      };

      timeBookings?.forEach(booking => {
        const hour = parseInt(booking.start_time.split(':')[0]);
        if (hour >= 6 && hour < 12) timeDistribution.morning++;
        else if (hour >= 12 && hour < 18) timeDistribution.afternoon++;
        else timeDistribution.evening++;
      });

      const total = timeDistribution.morning + timeDistribution.afternoon + timeDistribution.evening;
      const bookingDistribution = [
        {
          name: 'Morning (6-12)',
          value: total > 0 ? Math.round((timeDistribution.morning / total) * 100) : 0,
          color: '#0088FE'
        },
        {
          name: 'Afternoon (12-18)',
          value: total > 0 ? Math.round((timeDistribution.afternoon / total) * 100) : 0,
          color: '#00C49F'
        },
        {
          name: 'Evening (18-24)',
          value: total > 0 ? Math.round((timeDistribution.evening / total) * 100) : 0,
          color: '#FFBB28'
        }
      ];

      // Generate student activity data (simplified for now)
      const studentActivityData = [
        { hour: '06:00', active: Math.floor(Math.random() * 50) + 20 },
        { hour: '08:00', active: Math.floor(Math.random() * 100) + 80 },
        { hour: '10:00', active: Math.floor(Math.random() * 150) + 120 },
        { hour: '12:00', active: Math.floor(Math.random() * 200) + 150 },
        { hour: '14:00', active: Math.floor(Math.random() * 180) + 130 },
        { hour: '16:00', active: Math.floor(Math.random() * 220) + 180 },
        { hour: '18:00', active: Math.floor(Math.random() * 200) + 150 },
        { hour: '20:00', active: Math.floor(Math.random() * 150) + 100 },
        { hour: '22:00', active: Math.floor(Math.random() * 80) + 40 }
      ];

      setChartsData({
        revenueData,
        merchantData,
        bookingDistribution,
        studentActivityData
      });
    } catch (error) {
      console.error('Error fetching charts data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard charts data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartsData();
  }, []);

  return {
    chartsData,
    loading,
    refetch: fetchChartsData
  };
};
