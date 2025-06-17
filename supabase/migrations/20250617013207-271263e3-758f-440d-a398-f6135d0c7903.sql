
-- Fix admin user permissions and add test merchant data (without non-existent columns)
DO $$
DECLARE
    admin_user_id uuid := 'e3596776-aead-4914-a2af-338240ccc389';
    admin_role_id uuid;
BEGIN
    -- Ensure admin role exists and get its ID
    INSERT INTO public.custom_roles (name, description, is_system_role, color)
    VALUES ('admin', 'System Administrator', true, '#DC2626')
    ON CONFLICT (name) DO UPDATE SET
        is_system_role = true,
        description = 'System Administrator'
    RETURNING id INTO admin_role_id;
    
    -- If no ID returned from INSERT, get it from existing record
    IF admin_role_id IS NULL THEN
        SELECT id INTO admin_role_id 
        FROM public.custom_roles 
        WHERE name = 'admin' AND is_system_role = true;
    END IF;
    
    -- Update admin user profile
    INSERT INTO public.user_profiles (
        user_id, 
        full_name, 
        role, 
        custom_role_id
    ) VALUES (
        admin_user_id,
        'System Administrator',
        'admin',
        admin_role_id
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        role = 'admin',
        custom_role_id = admin_role_id,
        full_name = 'System Administrator',
        updated_at = now();
    
    -- Ensure admin has user_roles entry
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
    
    -- Create sample merchant data for testing
    INSERT INTO public.merchant_profiles (
        business_name,
        business_phone,
        full_name,
        contact_number,
        email,
        business_address,
        approval_status,
        verification_status,
        created_at
    ) VALUES 
    (
        'StudyHub Learning Center',
        '+91-9876543210',
        'Rajesh Kumar',
        '+91-9876543210',
        'rajesh@studyhub.com',
        '{"street": "MG Road", "city": "Bangalore", "state": "Karnataka", "pincode": "560001"}',
        'approved',
        'verified',
        now() - interval '30 days'
    ),
    (
        'EduSpace Premium',
        '+91-8765432109',
        'Priya Sharma',
        '+91-8765432109',
        'priya@eduspace.com',
        '{"street": "Park Street", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}',
        'pending',
        'pending',
        now() - interval '5 days'
    ),
    (
        'Focus Zone Study Hall',
        '+91-7654321098',
        'Amit Patel',
        '+91-7654321098',
        'amit@focuszone.com',
        '{"street": "FC Road", "city": "Pune", "state": "Maharashtra", "pincode": "411001"}',
        'approved',
        'verified',
        now() - interval '15 days'
    ),
    (
        'Smart Study Solutions',
        '+91-6543210987',
        'Neha Gupta',
        '+91-6543210987',
        'neha@smartstudy.com',
        '{"street": "Connaught Place", "city": "Delhi", "state": "Delhi", "pincode": "110001"}',
        'pending',
        'unverified',
        now() - interval '2 days'
    ),
    (
        'Excellence Study Center',
        '+91-5432109876',
        'Vikram Singh',
        '+91-5432109876',
        'vikram@excellence.com',
        '{"street": "Anna Salai", "city": "Chennai", "state": "Tamil Nadu", "pincode": "600001"}',
        'rejected',
        'unverified',
        now() - interval '10 days'
    )
    ON CONFLICT DO NOTHING;
    
END $$;

-- Ensure RLS policies allow admin access
DROP POLICY IF EXISTS "Admin can view all merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admin can manage all merchant profiles" ON public.merchant_profiles;

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
