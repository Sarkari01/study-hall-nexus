
-- Create sequences first
CREATE SEQUENCE IF NOT EXISTS students_seq START 1;
CREATE SEQUENCE IF NOT EXISTS bookings_seq START 1;

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL DEFAULT 'STU-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('students_seq')::text, 6, '0'),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_booking_date TIMESTAMP WITH TIME ZONE,
  average_session_duration TEXT DEFAULT '0h',
  preferred_study_halls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create study_halls table
CREATE TABLE public.study_halls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  merchant_id UUID,
  description TEXT,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 1,
  price_per_day NUMERIC NOT NULL DEFAULT 0,
  price_per_week NUMERIC,
  price_per_month NUMERIC,
  amenities TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'inactive', 'maintenance')),
  rating NUMERIC DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_bookings INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  operating_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT UNIQUE NOT NULL DEFAULT 'BK-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('bookings_seq')::text, 8, '0'),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  study_hall_id UUID REFERENCES public.study_halls(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  final_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add RLS policies for students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students are viewable by everyone" ON public.students
  FOR SELECT USING (true);

CREATE POLICY "Students can be inserted by authenticated users" ON public.students
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Students can be updated by authenticated users" ON public.students
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Students can be deleted by authenticated users" ON public.students
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add RLS policies for study_halls table
ALTER TABLE public.study_halls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Study halls are viewable by everyone" ON public.study_halls
  FOR SELECT USING (true);

CREATE POLICY "Study halls can be inserted by authenticated users" ON public.study_halls
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Study halls can be updated by authenticated users" ON public.study_halls
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Study halls can be deleted by authenticated users" ON public.study_halls
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add RLS policies for bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings are viewable by everyone" ON public.bookings
  FOR SELECT USING (true);

CREATE POLICY "Bookings can be inserted by authenticated users" ON public.bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Bookings can be updated by authenticated users" ON public.bookings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Bookings can be deleted by authenticated users" ON public.bookings
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add indexes for better performance
CREATE INDEX idx_students_email ON public.students(email);
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_study_halls_status ON public.study_halls(status);
CREATE INDEX idx_bookings_student_id ON public.bookings(student_id);
CREATE INDEX idx_bookings_study_hall_id ON public.bookings(study_hall_id);
CREATE INDEX idx_bookings_booking_date ON public.bookings(booking_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
