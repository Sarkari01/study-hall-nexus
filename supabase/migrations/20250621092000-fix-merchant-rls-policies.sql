
-- Fix RLS policies for merchant_profiles to handle null user_ids properly

-- Drop existing policies
DROP POLICY IF EXISTS "Merchants can view their own profile" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Merchants can update their own profile" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Merchants can create their own profile" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can view all merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can update all merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can create merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can delete merchant profiles" ON public.merchant_profiles;

-- Create improved RLS policies that handle null user_ids properly
CREATE POLICY "Merchants can view their own profile" ON public.merchant_profiles
  FOR SELECT USING (
    user_id IS NOT NULL AND user_id = auth.uid()
  );

CREATE POLICY "Merchants can update their own profile" ON public.merchant_profiles
  FOR UPDATE USING (
    user_id IS NOT NULL AND user_id = auth.uid()
  );

CREATE POLICY "Merchants can create their own profile" ON public.merchant_profiles
  FOR INSERT WITH CHECK (
    user_id IS NOT NULL AND user_id = auth.uid()
  );

-- Admin policies - these should allow access to ALL records including those with null user_ids
CREATE POLICY "Admins can view all merchant profiles" ON public.merchant_profiles
  FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Admins can update all merchant profiles" ON public.merchant_profiles
  FOR UPDATE USING (public.is_current_user_admin());

CREATE POLICY "Admins can create merchant profiles" ON public.merchant_profiles
  FOR INSERT WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can delete merchant profiles" ON public.merchant_profiles
  FOR DELETE USING (public.is_current_user_admin());

-- Add policy to allow admins to create merchants without user_id (for bulk imports, etc.)
CREATE POLICY "Admins can create merchant profiles without user_id" ON public.merchant_profiles
  FOR INSERT WITH CHECK (
    public.is_current_user_admin() AND user_id IS NULL
  );
