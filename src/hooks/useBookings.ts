
import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

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
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
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
  const { user, userRole, isAuthReady } = useAuth();
  const isMountedRef = useRef(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useBookings: Starting fetch, user:', user?.id, 'role:', userRole?.name);
      
      if (!user || !isAuthReady) {
        console.log('useBookings: User not authenticated or auth not ready');
        if (isMountedRef.current) {
          setBookings([]);
          setError('Authentication required');
          setLoading(false);
        }
        return;
      }

      // Admin can see all bookings, others see only their own
      let query = supabase
        .from('bookings')
        .select(`
          *,
          students!bookings_student_id_fkey (
            full_name,
            email,
            phone
          ),
          study_halls!bookings_study_hall_id_fkey (
            name,
            location
          )
        `)
        .order('created_at', { ascending: false });

      // If not admin, filter by user's bookings
      if (userRole?.name === 'student') {
        query = query.eq('student_id', user.id);
      } else if (userRole?.name === 'merchant') {
        // Merchants see bookings for their study halls
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('merchant_id')
          .eq('user_id', user.id)
          .single();

        if (userProfile?.merchant_id) {
          const { data: merchantHalls } = await supabase
            .from('study_halls')
            .select('id')
            .eq('merchant_id', userProfile.merchant_id);

          const hallIds = merchantHalls?.map(hall => hall.id) || [];
          if (hallIds.length > 0) {
            query = query.in('study_hall_id', hallIds);
          }
        }
      } else if (userRole?.name !== 'admin') {
        console.log('useBookings: User does not have permission to view bookings');
        if (isMountedRef.current) {
          setBookings([]);
          setError('Permission denied');
          setLoading(false);
        }
        return;
      }

      const { data: bookingsData, error: bookingsError } = await query;

      console.log('useBookings: Bookings response:', { data: bookingsData, error: bookingsError });

      if (bookingsError) {
        console.error('useBookings: Error fetching bookings:', bookingsError);
        throw bookingsError;
      }

      const typedBookings = (bookingsData || []).map(booking => ({
        ...booking,
        status: booking.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
        payment_status: booking.payment_status as 'pending' | 'paid' | 'failed' | 'refunded',
        student: booking.students ? {
          full_name: booking.students.full_name,
          email: booking.students.email,
          phone: booking.students.phone
        } : undefined,
        study_hall: booking.study_halls ? {
          name: booking.study_halls.name,
          location: booking.study_halls.location
        } : undefined
      }));

      console.log('useBookings: Final processed bookings:', typedBookings);

      if (isMountedRef.current) {
        setBookings(typedBookings);
        setError(null);
        
        toast({
          title: "Success",
          description: `Loaded ${typedBookings.length} bookings`,
        });
      }
    } catch (err) {
      console.error('useBookings: Error in fetchBookings:', err);
      if (isMountedRef.current) {
        setError('Failed to fetch bookings');
        setBookings([]);
        toast({
          title: "Error",
          description: "Failed to fetch bookings. Please check your permissions.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    try {
      console.log('useBookings: Updating booking:', bookingId, updates);
      
      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId);

      if (error) throw error;

      if (isMountedRef.current) {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, ...updates }
            : booking
        ));

        toast({
          title: "Success",
          description: "Booking updated successfully",
        });
      }
    } catch (err) {
      console.error('useBookings: Error updating booking:', err);
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to update booking",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    if (isAuthReady) {
      fetchBookings();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user, userRole, isAuthReady]);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    updateBooking
  };
};
