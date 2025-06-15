
-- Enable RLS on merchant_profiles table if not already enabled
ALTER TABLE public.merchant_profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select all merchant profiles (for admin view)
CREATE POLICY "Allow authenticated users to view merchant profiles" 
  ON public.merchant_profiles 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow authenticated users to insert merchant profiles
CREATE POLICY "Allow authenticated users to create merchant profiles" 
  ON public.merchant_profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Allow authenticated users to update merchant profiles
CREATE POLICY "Allow authenticated users to update merchant profiles" 
  ON public.merchant_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Allow authenticated users to delete merchant profiles
CREATE POLICY "Allow authenticated users to delete merchant profiles" 
  ON public.merchant_profiles 
  FOR DELETE 
  TO authenticated 
  USING (true);
