
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  type: 'booking' | 'payment' | 'registration' | 'verification';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  amount?: number;
  status?: string;
}

export const useRecentActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const recentActivities: Activity[] = [];

      try {
        // Fetch recent bookings with error handling
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_reference,
            status,
            final_amount,
            created_at,
            student:students(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (bookingsError) {
          console.warn('Recent bookings fetch error:', bookingsError);
        } else if (bookings) {
          bookings.forEach(booking => {
            recentActivities.push({
              id: booking.id,
              type: 'booking',
              title: 'New Booking Created',
              description: `Booking ${booking.booking_reference} by ${booking.student?.full_name || 'Unknown'}`,
              timestamp: booking.created_at,
              amount: Number(booking.final_amount),
              status: booking.status
            });
          });
        }
      } catch (error) {
        console.warn('Error fetching recent bookings:', error);
      }

      try {
        // Fetch recent merchant registrations with error handling
        const { data: merchants, error: merchantsError } = await supabase
          .from('merchant_profiles')
          .select('id, business_name, full_name, created_at, verification_status')
          .order('created_at', { ascending: false })
          .limit(3);

        if (merchantsError) {
          console.warn('Recent merchants fetch error:', merchantsError);
        } else if (merchants) {
          merchants.forEach(merchant => {
            recentActivities.push({
              id: merchant.id,
              type: 'registration',
              title: 'New Merchant Registration',
              description: `${merchant.business_name || merchant.full_name} registered`,
              timestamp: merchant.created_at,
              status: merchant.verification_status
            });
          });
        }
      } catch (error) {
        console.warn('Error fetching recent merchants:', error);
      }

      try {
        // Fetch recent wallet transactions with error handling
        const { data: transactions, error: transactionsError } = await supabase
          .from('wallet_transactions')
          .select('id, description, amount, transaction_type, created_at, status')
          .order('created_at', { ascending: false })
          .limit(4);

        if (transactionsError) {
          console.warn('Recent transactions fetch error:', transactionsError);
        } else if (transactions) {
          transactions.forEach(transaction => {
            recentActivities.push({
              id: transaction.id,
              type: 'payment',
              title: 'Payment Transaction',
              description: transaction.description,
              timestamp: transaction.created_at,
              amount: Number(transaction.amount),
              status: transaction.status
            });
          });
        }
      } catch (error) {
        console.warn('Error fetching recent transactions:', error);
      }

      // Sort all activities by timestamp and limit to 10
      recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(recentActivities.slice(0, 10));

      console.log('Recent activities loaded successfully:', recentActivities.length, 'activities');
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      toast({
        title: "Warning",
        description: "Recent activities could not be loaded.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  return {
    activities,
    loading,
    refetch: fetchRecentActivities
  };
};
