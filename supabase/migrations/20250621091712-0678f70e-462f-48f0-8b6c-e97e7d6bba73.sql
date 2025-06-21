
-- Step 1: Clean up all existing RLS policies on merchant_profiles (including any existing ones)
DROP POLICY IF EXISTS "Merchants can view their own profile" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Merchants can update their own profile" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Merchants can insert their own profile" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Merchants can create their own profile" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can view all merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can update all merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can insert merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can create merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can delete merchant profiles" ON public.merchant_profiles;

-- Step 2: Clean up all existing RLS policies on user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow profile creation for authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.user_profiles;

-- Step 3: Create/ensure the current user has an admin profile
INSERT INTO public.user_profiles (user_id, full_name, role)
SELECT 
  auth.uid(),
  'System Administrator',
  'admin'
WHERE auth.uid() IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid()
  );

-- Update existing profile to admin if it exists but isn't admin
UPDATE public.user_profiles 
SET role = 'admin'
WHERE user_id = auth.uid() 
  AND (role != 'admin' OR role IS NULL);

-- Step 4: Create clean RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Allow profile creation for authenticated users" ON public.user_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Admins can update all profiles" ON public.user_profiles
  FOR UPDATE USING (public.is_current_user_admin());

-- Step 5: Create clean RLS policies for merchant_profiles
CREATE POLICY "Merchants can view their own profile" ON public.merchant_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Merchants can update their own profile" ON public.merchant_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Merchants can create their own profile" ON public.merchant_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all merchant profiles" ON public.merchant_profiles
  FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Admins can update all merchant profiles" ON public.merchant_profiles
  FOR UPDATE USING (public.is_current_user_admin());

CREATE POLICY "Admins can create merchant profiles" ON public.merchant_profiles
  FOR INSERT WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can delete merchant profiles" ON public.merchant_profiles
  FOR DELETE USING (public.is_current_user_admin());
