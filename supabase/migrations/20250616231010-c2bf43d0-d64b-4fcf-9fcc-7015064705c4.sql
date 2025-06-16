
-- First, let's ensure the current admin user has proper profile setup
-- Update the admin user profile to have the correct role and custom_role_id
DO $$
DECLARE
    admin_user_id uuid := 'e3596776-aead-4914-a2af-338240ccc389';
    admin_role_id uuid;
BEGIN
    -- Get the admin role ID
    SELECT id INTO admin_role_id 
    FROM public.custom_roles 
    WHERE name = 'admin' AND is_system_role = true;
    
    -- Insert or update the admin user profile
    INSERT INTO public.user_profiles (
        user_id, 
        full_name, 
        role, 
        custom_role_id
    ) VALUES (
        admin_user_id,
        'Admin User',
        'admin',
        admin_role_id
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        role = 'admin',
        custom_role_id = admin_role_id,
        updated_at = now();
        
    -- Ensure the admin has a user_roles entry as well
    IF admin_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (
            user_id,
            role_id,
            is_active,
            assigned_at
        ) VALUES (
            admin_user_id,
            admin_role_id,
            true,
            now()
        )
        ON CONFLICT (user_id, role_id) 
        DO UPDATE SET 
            is_active = true,
            assigned_at = now();
    END IF;
END $$;

-- Create RLS policies for merchant_profiles to allow admin access
DROP POLICY IF EXISTS "Admin can view all merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admin can manage all merchant profiles" ON public.merchant_profiles;

-- Enable RLS on merchant_profiles if not already enabled
ALTER TABLE public.merchant_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies using the safe functions
CREATE POLICY "Admin can view all merchant profiles" ON public.merchant_profiles
FOR SELECT USING (
    public.get_user_role_safe(auth.uid()) = 'admin'
    OR auth.uid() = user_id
);

CREATE POLICY "Admin can manage all merchant profiles" ON public.merchant_profiles
FOR ALL USING (
    public.get_user_role_safe(auth.uid()) = 'admin'
    OR auth.uid() = user_id
);
