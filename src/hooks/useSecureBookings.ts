
import { useSecureData } from './useSecureData';
import { isValidEmail, isValidUUID } from '@/utils/typeGuards';

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
  updated_at: string;
}

const validateBookingData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  // Validate required fields
  if (!data.student_id || !isValidUUID(data.student_id)) return false;
  if (!data.study_hall_id || !isValidUUID(data.study_hall_id)) return false;
  if (!data.booking_date || isNaN(Date.parse(data.booking_date))) return false;
  if (!data.start_time || !data.end_time) return false;
  if (typeof data.total_amount !== 'number' || data.total_amount < 0) return false;
  if (typeof data.final_amount !== 'number' || data.final_amount < 0) return false;
  
  // Validate status values
  const validStatuses = ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show'];
  const validPaymentStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'];
  
  if (data.status && !validStatuses.includes(data.status)) return false;
  if (data.payment_status && !validPaymentStatuses.includes(data.payment_status)) return false;
  
  return true;
};

export const useSecureBookings = () => {
  return useSecureData<Booking>({
    table: 'bookings',
    auditResource: 'booking',
    requireAuth: true,
    validateData: validateBookingData
  });
};
