
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateBookingData, sanitizeInput, rateLimiter } from '@/utils/inputValidation';

interface BookingData {
  student_name: string;
  student_email: string;
  student_phone: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  study_hall_id: string;
}

export const useSecureBooking = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createSecureBooking = async (bookingData: BookingData) => {
    // Rate limiting
    const userIdentifier = `${bookingData.student_email}-${Date.now()}`;
    if (!rateLimiter.isAllowed(userIdentifier, 2, 300000)) { // 2 attempts per 5 minutes
      throw new Error('Too many booking attempts. Please wait before trying again.');
    }

    // Validate input data
    const validation = validateBookingData(bookingData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    setLoading(true);
    try {
      // Sanitize all input data
      const sanitizedData = {
        student_name: sanitizeInput(bookingData.student_name),
        student_email: bookingData.student_email.toLowerCase().trim(),
        student_phone: bookingData.student_phone.replace(/[^\d\s\-\(\)\+]/g, ''),
        booking_date: bookingData.booking_date,
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
        study_hall_id: bookingData.study_hall_id
      };

      // Verify study hall exists and is active
      const { data: studyHall, error: studyHallError } = await supabase
        .from('study_halls')
        .select('id, name, price_per_day, status')
        .eq('id', sanitizedData.study_hall_id)
        .eq('status', 'active')
        .single();

      if (studyHallError || !studyHall) {
        throw new Error('Invalid or inactive study hall');
      }

      // Check for existing student or create new one
      let { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('email', sanitizedData.student_email)
        .maybeSingle();

      if (studentError) {
        throw new Error('Error checking student records');
      }

      if (!student) {
        const { data: newStudent, error: createStudentError } = await supabase
          .from('students')
          .insert([{
            full_name: sanitizedData.student_name,
            email: sanitizedData.student_email,
            phone: sanitizedData.student_phone,
            status: 'active'
          }])
          .select('id')
          .single();

        if (createStudentError) {
          throw new Error('Failed to create student record');
        }

        student = newStudent;
      }

      // Check for conflicting bookings
      const { data: conflictingBookings, error: conflictError } = await supabase
        .from('bookings')
        .select('id')
        .eq('study_hall_id', sanitizedData.study_hall_id)
        .eq('booking_date', sanitizedData.booking_date)
        .or(`start_time.lte.${sanitizedData.end_time},end_time.gte.${sanitizedData.start_time}`)
        .in('status', ['pending', 'confirmed', 'checked_in']);

      if (conflictError) {
        throw new Error('Error checking booking conflicts');
      }

      if (conflictingBookings && conflictingBookings.length > 0) {
        throw new Error('Time slot not available. Please choose a different time.');
      }

      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          student_id: student.id,
          study_hall_id: sanitizedData.study_hall_id,
          booking_date: sanitizedData.booking_date,
          start_time: sanitizedData.start_time,
          end_time: sanitizedData.end_time,
          total_amount: studyHall.price_per_day,
          final_amount: studyHall.price_per_day,
          status: 'pending',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (bookingError) {
        throw new Error('Failed to create booking');
      }

      toast({
        title: "Booking Created Successfully",
        description: `Your booking for ${studyHall.name} has been created.`,
      });

      return booking;

    } catch (error) {
      console.error('Secure booking error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
      
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSecureBooking,
    loading
  };
};
