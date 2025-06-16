
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMerchantStudyHalls } from './useMerchantStudyHalls';

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
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  // Joined data
  study_hall?: {
    name: string;
    location: string;
  };
  student?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

export const useMerchantBookings = () => {
  const { studyHalls } = useMerchantStudyHalls();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    if (!studyHalls.length) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const studyHallIds = studyHalls.map(hall => hall.id);

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          study_halls!inner(name, location),
          user_profiles!inner(full_name, phone)
        `)
        .in('study_hall_id', studyHallIds)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching bookings:', fetchError);
        setError('Failed to load bookings');
        return;
      }

      setBookings(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { data, error: updateError } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating booking status:', updateError);
        throw new Error('Failed to update booking status');
      }

      setBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      ));

      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });

      return data;
    } catch (err) {
      console.error('Error updating booking status:', err);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    if (studyHalls.length > 0) {
      fetchBookings();
    }
  }, [studyHalls]);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    updateBookingStatus,
    refetch: fetchBookings,
  };
};
