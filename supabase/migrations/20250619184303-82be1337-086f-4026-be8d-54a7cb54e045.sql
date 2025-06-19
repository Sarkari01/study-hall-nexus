
-- Update RLS policies for students table to allow public booking creation

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Students can manage their own profile" ON public.students;

-- Create separate policies for different operations
-- Allow anyone to insert student records (for public booking)
CREATE POLICY "Anyone can create student records" ON public.students
FOR INSERT WITH CHECK (true);

-- Allow students to view their own records (authenticated users only)
CREATE POLICY "Students can view their own profile" ON public.students
FOR SELECT USING (
  email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ) OR public.is_admin()
);

-- Allow students to update their own records (authenticated users only) 
CREATE POLICY "Students can update their own profile" ON public.students
FOR UPDATE USING (
  email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ) OR public.is_admin()
);

-- Allow admins to delete student records
CREATE POLICY "Admins can delete student records" ON public.students
FOR DELETE USING (public.is_admin());
