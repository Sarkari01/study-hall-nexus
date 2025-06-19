
-- Complete fix for infinite recursion in RLS policies
-- This replaces the previous migration with a proper solution

-- Drop ALL problematic policies to start fresh
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own profile roles" ON public.user_roles;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Drop existing problematic functions
DROP FUNCTION IF EXISTS public.get_user_role_direct(uuid);
DROP FUNCTION IF EXISTS public.is_admin_direct();

-- Create new security definer functions that bypass RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role_safe()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role 
  FROM user_profiles 
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Create simple, non-recursive policies for user_profiles
-- Users can always see and update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE USING (user_id = auth.uid());

-- Admins can see all profiles using the security definer function
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Admins can update all profiles" ON public.user_profiles
FOR UPDATE USING (public.is_current_user_admin());

CREATE POLICY "Admins can insert profiles" ON public.user_profiles
FOR INSERT WITH CHECK (public.is_current_user_admin());

-- Create simple policies for user_roles table
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL USING (public.is_current_user_admin());

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION public.get_current_user_role_safe() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;
