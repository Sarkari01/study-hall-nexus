
-- Add a function to create a new user with email and password, then create merchant profile
CREATE OR REPLACE FUNCTION public.create_merchant_with_auth(
  p_email text,
  p_password text,
  p_business_name text,
  p_business_phone text,
  p_full_name text,
  p_contact_number text,
  p_business_address jsonb,
  p_communication_address jsonb DEFAULT NULL,
  p_bank_account_details jsonb DEFAULT NULL,
  p_incharge_name text DEFAULT NULL,
  p_incharge_designation text DEFAULT NULL,
  p_incharge_phone text DEFAULT NULL,
  p_incharge_email text DEFAULT NULL,
  p_incharge_address jsonb DEFAULT NULL,
  p_refundable_security_deposit numeric DEFAULT 0,
  p_approval_status text DEFAULT 'pending',
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  new_merchant_id uuid;
BEGIN
  -- Create the user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
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
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('full_name', p_full_name),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Create the merchant profile
  INSERT INTO public.merchant_profiles (
    user_id,
    business_name,
    business_phone,
    full_name,
    contact_number,
    business_address,
    communication_address,
    bank_account_details,
    incharge_name,
    incharge_designation,
    incharge_phone,
    incharge_email,
    incharge_address,
    refundable_security_deposit,
    approval_status,
    notes
  ) VALUES (
    new_user_id,
    p_business_name,
    p_business_phone,
    p_full_name,
    p_contact_number,
    p_business_address,
    p_communication_address,
    p_bank_account_details,
    p_incharge_name,
    p_incharge_designation,
    p_incharge_phone,
    p_incharge_email,
    p_incharge_address,
    p_refundable_security_deposit,
    p_approval_status,
    p_notes
  ) RETURNING id INTO new_merchant_id;

  -- Create user profile
  INSERT INTO public.user_profiles (
    user_id,
    full_name,
    role,
    merchant_id
  ) VALUES (
    new_user_id,
    p_full_name,
    'merchant',
    new_merchant_id
  );

  RETURN new_merchant_id;
END;
$$;

-- Add email field to merchant_profiles for easier management
ALTER TABLE public.merchant_profiles 
ADD COLUMN IF NOT EXISTS email text;

-- Create unique index on email for merchant_profiles
CREATE UNIQUE INDEX IF NOT EXISTS merchant_profiles_email_idx 
ON public.merchant_profiles (email) 
WHERE email IS NOT NULL;
