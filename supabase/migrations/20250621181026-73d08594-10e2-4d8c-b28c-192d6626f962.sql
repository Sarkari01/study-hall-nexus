
-- Fix the has_role_secure function with correct logic
CREATE OR REPLACE FUNCTION public.has_role_secure(role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_id = auth.uid() AND role = role_name
  );
$$;
