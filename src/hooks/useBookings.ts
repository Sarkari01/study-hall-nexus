
import { useState, useEffect } from 'react';
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

// Mock data for now
const mockBookings: Booking[] = [
  {
    id: '1',
    booking_reference: 'BOK000001',
    student_id: '1',
    study_hall_id: '1',
    booking_date: '2024-06-15',
    start_time: '09:00',
    end_time: '17:00',
    total_amount: 250,
    final_amount: 250,
    status: 'confirmed',
    payment_status: 'completed',
    created_at: '2024-06-14T10:00:00Z',
    student: {
      full_name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 9876543210'
    },
    study_hall: {
      name: 'Central Study Hub',
      location: 'Delhi'
    }
  }
];

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Supabase call once types are updated
      // const { data, error } = await supabase
      //   .from('bookings')
      //   .select(`
      //     *,
      //     student:students(full_name, email, phone),
      //     study_hall:study_halls(name, location)
      //   `)
      //   .order('created_at', { ascending: false });

      setTimeout(() => {
        setBookings(mockBookings);
        setError(null);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      // TODO: Replace with actual Supabase call
      // const { error } = await supabase
      //   .from('bookings')
      //   .update({ status })
      //   .eq('id', bookingId);

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
