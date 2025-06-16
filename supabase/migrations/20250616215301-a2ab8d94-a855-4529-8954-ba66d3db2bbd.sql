
-- Create or ensure admin user exists with proper authentication
DO $$
DECLARE
  admin_user_id uuid;
  admin_role_id uuid;
  existing_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO existing_user_id 
  FROM auth.users 
  WHERE email = 'admin@sarkari-ninja.com';

  IF existing_user_id IS NULL THEN
    -- Get the admin role ID
    SELECT id INTO admin_role_id 
    FROM public.custom_roles 
    WHERE name = 'admin' AND is_system_role = true;

    -- Create new admin user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      email_change_confirm_status,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@sarkari-ninja.com',
      crypt('Admin123!@#', gen_salt('bf')),
      now(),
      0,
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "System Administrator"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_user_id;

    -- Create user profile if it doesn't exist
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
    ) ON CONFLICT (user_id) DO NOTHING;

    -- Create user wallet if it doesn't exist
    INSERT INTO public.user_wallets (user_id, balance, reward_points)
    VALUES (admin_user_id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;

    RAISE NOTICE 'New admin user created with ID: %', admin_user_id;
  ELSE
    -- Update existing user password
    UPDATE auth.users 
    SET encrypted_password = crypt('Admin123!@#', gen_salt('bf')),
        updated_at = now()
    WHERE id = existing_user_id;
    
    RAISE NOTICE 'Existing admin user updated with ID: %', existing_user_id;
  END IF;

  RAISE NOTICE 'Admin login details:';
  RAISE NOTICE 'Email: admin@sarkari-ninja.com';
  RAISE NOTICE 'Password: Admin123!@#';
END $$;
