
-- Add incharge details columns to merchant_profiles table
ALTER TABLE public.merchant_profiles 
ADD COLUMN incharge_name TEXT,
ADD COLUMN incharge_designation TEXT,
ADD COLUMN incharge_phone TEXT,
ADD COLUMN incharge_email TEXT,
ADD COLUMN incharge_address JSONB;

-- Add comment for documentation
COMMENT ON COLUMN public.merchant_profiles.incharge_name IS 'Name of the person in charge/manager at the merchant location';
COMMENT ON COLUMN public.merchant_profiles.incharge_designation IS 'Job title/designation of the incharge person';
COMMENT ON COLUMN public.merchant_profiles.incharge_phone IS 'Contact phone number of the incharge person';
COMMENT ON COLUMN public.merchant_profiles.incharge_email IS 'Email address of the incharge person';
COMMENT ON COLUMN public.merchant_profiles.incharge_address IS 'Address details of the incharge person in JSON format';
