
-- Create booking_seats table to track individual seat bookings
CREATE TABLE public.booking_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  seat_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create seat_layouts table to store study hall seat configurations
CREATE TABLE public.seat_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_hall_id UUID NOT NULL,
  seat_id TEXT NOT NULL,
  row_number INTEGER NOT NULL,
  seat_number INTEGER NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  seat_type TEXT DEFAULT 'standard',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(study_hall_id, seat_id)
);

-- Create payment_transactions table for tracking payments
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  gateway_transaction_id TEXT,
  gateway_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.booking_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for booking_seats
CREATE POLICY "Users can view booking seats for their bookings" ON public.booking_seats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.id = booking_id AND b.student_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert booking seats for their bookings" ON public.booking_seats
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.id = booking_id AND b.student_id = auth.uid()
    )
  );

-- RLS policies for seat_layouts (public read access)
CREATE POLICY "Anyone can view seat layouts" ON public.seat_layouts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update seat availability" ON public.seat_layouts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS policies for payment_transactions
CREATE POLICY "Users can view their payment transactions" ON public.payment_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.id = booking_id AND b.student_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert payment transactions for their bookings" ON public.payment_transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.id = booking_id AND b.student_id = auth.uid()
    )
  );

-- Add foreign key constraints
ALTER TABLE public.booking_seats
  ADD CONSTRAINT fk_booking_seats_booking 
  FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;

ALTER TABLE public.seat_layouts
  ADD CONSTRAINT fk_seat_layouts_study_hall 
  FOREIGN KEY (study_hall_id) REFERENCES public.study_halls(id) ON DELETE CASCADE;

ALTER TABLE public.payment_transactions
  ADD CONSTRAINT fk_payment_transactions_booking 
  FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;

-- Add updated_at trigger for seat_layouts
CREATE TRIGGER update_seat_layouts_updated_at
  BEFORE UPDATE ON public.seat_layouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for payment_transactions
CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample seat layouts for existing study halls
INSERT INTO public.seat_layouts (study_hall_id, seat_id, row_number, seat_number, is_available)
SELECT 
  s.id as study_hall_id,
  chr(65 + row_num) || (seat_num + 1) as seat_id,
  row_num + 1 as row_number,
  seat_num + 1 as seat_number,
  CASE WHEN random() > 0.3 THEN true ELSE false END as is_available
FROM 
  public.study_halls s,
  generate_series(0, 5) as row_num,
  generate_series(0, 7) as seat_num
WHERE s.status = 'active';
