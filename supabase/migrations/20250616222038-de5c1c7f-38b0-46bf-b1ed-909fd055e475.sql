
-- Fix the infinite recursion in RLS policies by removing problematic policies
-- and creating proper security definer functions

-- First, drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Everyone can view permissions" ON public.permissions;
DROP POLICY IF EXISTS "Everyone can view role permissions" ON public.role_permissions;

-- Create security definer functions to safely check user roles and permissions
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT cr.name 
  FROM public.user_profiles up
  LEFT JOIN public.custom_roles cr ON up.custom_role_id = cr.id
  WHERE up.user_id = $1
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_user_permissions_safe(user_id uuid)
RETURNS TABLE(permission_name text, permission_description text, module text, action text)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT DISTINCT p.name, p.description, p.module, p.action
  FROM public.user_profiles up
  LEFT JOIN public.custom_roles cr ON up.custom_role_id = cr.id
  LEFT JOIN public.role_permissions rp ON cr.id = rp.role_id
  LEFT JOIN public.permissions p ON rp.permission_id = p.id
  WHERE up.user_id = $1 AND p.name IS NOT NULL;
$$;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view their own profile roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

-- Allow everyone to view permissions and role permissions (they're not sensitive)
CREATE POLICY "Public can view permissions" ON public.permissions
FOR SELECT USING (true);

CREATE POLICY "Public can view role permissions" ON public.role_permissions
FOR SELECT USING (true);

-- Update user profiles that have role strings but missing custom_role_id
UPDATE public.user_profiles 
SET custom_role_id = cr.id
FROM public.custom_roles cr
WHERE public.user_profiles.role = cr.name 
  AND public.user_profiles.custom_role_id IS NULL 
  AND cr.is_system_role = true;

-- Ensure admin user has proper role setup
DO $$
DECLARE
    admin_user_id uuid := 'e3596776-aead-4914-a2af-338240ccc389';
    admin_role_id uuid;
BEGIN
    -- Get admin role ID
    SELECT id INTO admin_role_id 
    FROM public.custom_roles 
    WHERE name = 'admin' AND is_system_role = true;
    
    -- Update admin user profile if needed
    IF admin_role_id IS NOT NULL THEN
        UPDATE public.user_profiles 
        SET custom_role_id = admin_role_id, role = 'admin'
        WHERE user_id = admin_user_id;
    END IF;
END $$;
