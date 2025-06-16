
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingData {
  studyHallId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  selectedSeats: string[];
  totalAmount: number;
}

interface PaymentData {
  method: 'upi' | 'card' | 'wallet';
  amount: number;
}

export const useBookingFlow = () => {
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const { toast } = useToast();

  const createBooking = async (bookingData: BookingData) => {
    try {
      setLoading(true);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          student_id: user.user.id,
          study_hall_id: bookingData.studyHallId,
          booking_date: bookingData.bookingDate,
          start_time: bookingData.startTime,
          end_time: bookingData.endTime,
          total_amount: bookingData.totalAmount,
          final_amount: bookingData.totalAmount,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create seat assignments
      if (bookingData.selectedSeats.length > 0) {
        const seatInserts = bookingData.selectedSeats.map(seatId => ({
          booking_id: booking.id,
          seat_id: seatId
        }));

        const { error: seatsError } = await supabase
          .from('booking_seats')
          .insert(seatInserts);

        if (seatsError) throw seatsError;
      }

      setBookingId(booking.id);
      
      toast({
        title: "Booking Created",
        description: `Booking ${booking.booking_reference} has been created successfully.`,
      });

      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (paymentData: PaymentData) => {
    try {
      setLoading(true);
      
      if (!bookingId) {
        throw new Error('No booking found to process payment for');
      }

      // Create payment transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          booking_id: bookingId,
          amount: paymentData.amount,
          payment_method: paymentData.method,
          payment_status: 'pending',
          currency: 'INR'
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // For demo purposes, simulate payment success
      // In production, this would integrate with actual payment gateway
      setTimeout(async () => {
        try {
          // Update payment transaction
          await supabase
            .from('payment_transactions')
            .update({
              payment_status: 'completed',
              gateway_transaction_id: `TXN_${Date.now()}`
            })
            .eq('id', transaction.id);

          // Update booking status
          await supabase
            .from('bookings')
            .update({
              status: 'confirmed',
              payment_status: 'paid'
            })
            .eq('id', bookingId);

          toast({
            title: "Payment Successful",
            description: "Your booking has been confirmed!",
          });
        } catch (error) {
          console.error('Error updating payment status:', error);
        }
      }, 2000);

      return transaction;
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "Failed to cancel booking",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    bookingId,
    createBooking,
    processPayment,
    cancelBooking
  };
};
