
-- Fix infinite recursion in RLS policies and implement proper security
-- Handle existing policies more carefully

-- First, drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view their own profile roles" ON public.user_roles;

-- Drop any other problematic policies that might reference user_roles recursively
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Create security definer functions to safely check user roles and permissions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT cr.name 
  FROM public.user_profiles up
  LEFT JOIN public.custom_roles cr ON up.custom_role_id = cr.id
  WHERE up.user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_profiles up
    LEFT JOIN public.custom_roles cr ON up.custom_role_id = cr.id
    WHERE up.user_id = auth.uid() AND cr.name = 'admin'
  );
$$;

-- Create safe, non-recursive policies using security definer functions
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR ALL USING (public.is_admin());

-- Fix user_profiles policies to be non-recursive
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile" ON public.user_profiles
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" ON public.user_profiles
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON public.user_profiles
FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can insert profiles" ON public.user_profiles
FOR INSERT WITH CHECK (public.is_admin());

-- Tighten security on study_halls - only merchants who own them and admins
DROP POLICY IF EXISTS "Study halls can be inserted by authenticated users" ON public.study_halls;
DROP POLICY IF EXISTS "Study halls can be updated by authenticated users" ON public.study_halls;
DROP POLICY IF EXISTS "Study halls can be deleted by authenticated users" ON public.study_halls;

CREATE POLICY "Merchants can manage their own study halls" ON public.study_halls
FOR ALL USING (
  merchant_id IN (
    SELECT id FROM public.merchant_profiles WHERE user_id = auth.uid()
  ) OR public.is_admin()
);

-- Tighten security on bookings - only booking owners, related merchants, and admins
DROP POLICY IF EXISTS "Bookings can be inserted by authenticated users" ON public.bookings;
DROP POLICY IF EXISTS "Bookings can be updated by authenticated users" ON public.bookings;
DROP POLICY IF EXISTS "Bookings can be deleted by authenticated users" ON public.bookings;

CREATE POLICY "Users can manage relevant bookings" ON public.bookings
FOR ALL USING (
  student_id IN (
    SELECT id FROM public.students WHERE email IN (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  ) OR 
  study_hall_id IN (
    SELECT id FROM public.study_halls WHERE merchant_id IN (
      SELECT id FROM public.merchant_profiles WHERE user_id = auth.uid()
    )
  ) OR 
  public.is_admin()
);

-- Tighten security on students - only profile owners and admins
DROP POLICY IF EXISTS "Students can be inserted by authenticated users" ON public.students;
DROP POLICY IF EXISTS "Students can be updated by authenticated users" ON public.students;
DROP POLICY IF EXISTS "Students can be deleted by authenticated users" ON public.students;

CREATE POLICY "Students can manage their own profile" ON public.students
FOR ALL USING (
  email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ) OR public.is_admin()
);

-- Fix merchant_profiles conflicting policies
DROP POLICY IF EXISTS "Allow authenticated users to view merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to create merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to delete merchant profiles" ON public.merchant_profiles;

-- Keep existing merchant policies but ensure they don't conflict
DROP POLICY IF EXISTS "Merchants and admins can view profiles" ON public.merchant_profiles;
CREATE POLICY "Merchants and admins can view profiles" ON public.merchant_profiles
FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Merchants and admins can update profiles" ON public.merchant_profiles;
CREATE POLICY "Merchants and admins can update profiles" ON public.merchant_profiles
FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can create merchant profiles" ON public.merchant_profiles;
CREATE POLICY "Authenticated users can create merchant profiles" ON public.merchant_profiles
FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Ensure audit_logs are properly secured
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "System can insert audit logs" ON public.audit_logs
FOR INSERT WITH CHECK (true);

-- Secure notification tables
DROP POLICY IF EXISTS "Admins can manage notification logs" ON public.notification_logs;
CREATE POLICY "Admins can manage notification logs" ON public.notification_logs
FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Users can manage their own notification tokens" ON public.user_notification_tokens;
CREATE POLICY "Users can manage their own notification tokens" ON public.user_notification_tokens
FOR ALL USING (user_id = auth.uid());
