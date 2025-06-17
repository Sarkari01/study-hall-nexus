
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Booking {
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
  // Relations
  student?: {
    full_name: string;
    email: string;
    phone: string;
  };
  study_hall?: {
    name: string;
    location: string;
  };
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          student:students(full_name, email, phone),
          study_hall:study_halls(name, location)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion to ensure status fields match our interface
      const typedBookings = (data || []).map(booking => ({
        ...booking,
        status: booking.status as 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'no_show',
        payment_status: booking.payment_status as 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled'
      }));

      setBookings(typedBookings);
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

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status }
          : booking
      ));

      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    } catch (err) {
      console.error('Error updating booking:', err);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    updateBookingStatus
  };
};
