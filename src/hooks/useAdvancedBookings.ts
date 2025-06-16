
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdvancedBooking {
  id: string;
  booking_reference: string;
  student_id: string;
  study_hall_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  final_amount: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  created_at: string;
  booking_seats: Array<{
    seat_id: string;
  }>;
  study_hall: {
    name: string;
    location: string;
  };
  payment_transactions: Array<{
    gateway_transaction_id: string;
    payment_method: string;
  }>;
}

export const useAdvancedBookings = () => {
  const [bookings, setBookings] = useState<AdvancedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          booking_seats(seat_id),
          study_hall:study_halls(name, location),
          payment_transactions(gateway_transaction_id, payment_method)
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBookings(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          payment_status: 'refunded'
        })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const, payment_status: 'refunded' as const }
          : booking
      ));

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled and refund initiated",
      });
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const checkInBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'checked_in' })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'checked_in' as const }
          : booking
      ));

      toast({
        title: "Check-in Successful",
        description: "You have been checked in to your study hall",
      });
    } catch (err) {
      console.error('Error checking in:', err);
      toast({
        title: "Error",
        description: "Failed to check in",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Set up real-time subscription for booking updates
    const subscription = supabase
      .channel('booking-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, (payload) => {
        console.log('Booking updated:', payload);
        fetchBookings(); // Refresh bookings on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    cancelBooking,
    checkInBooking
  };
};
