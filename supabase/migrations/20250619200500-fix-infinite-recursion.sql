
-- Fix infinite recursion in RLS policies by removing problematic policies
-- and using security definer functions instead

-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own profile roles" ON public.user_roles;

-- Create or replace security definer functions to safely check user roles
CREATE OR REPLACE FUNCTION public.get_user_role_direct(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT up.role 
  FROM public.user_profiles up
  WHERE up.user_id = $1
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_direct()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_profiles up
    WHERE up.user_id = auth.uid() AND up.role = 'admin'
  );
$$;

-- Create simple, non-recursive policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (public.is_admin_direct());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL USING (public.is_admin_direct());

-- Fix any other problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Recreate user_profiles policies without recursion
CREATE POLICY "Users can view their own profile" ON public.user_profiles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.user_profiles
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up2 
    WHERE up2.user_id = auth.uid() AND up2.role = 'admin'
  )
);

CREATE POLICY "Admins can update all profiles" ON public.user_profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up2 
    WHERE up2.user_id = auth.uid() AND up2.role = 'admin'
  )
);

CREATE POLICY "Admins can insert profiles" ON public.user_profiles
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles up2 
    WHERE up2.user_id = auth.uid() AND up2.role = 'admin'
  )
);
