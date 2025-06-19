
-- Fix RLS policies for merchant_profiles table
DROP POLICY IF EXISTS "Merchants can view their own profile" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Merchants can update their own profile" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Merchants can insert their own profile" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can view all merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can update all merchant profiles" ON public.merchant_profiles;
DROP POLICY IF EXISTS "Admins can insert merchant profiles" ON public.merchant_profiles;

-- Create comprehensive RLS policies for merchant_profiles
CREATE POLICY "Merchants can view their own profile" ON public.merchant_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Merchants can update their own profile" ON public.merchant_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Merchants can insert their own profile" ON public.merchant_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all merchant profiles" ON public.merchant_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      LEFT JOIN public.custom_roles cr ON up.custom_role_id = cr.id
      WHERE up.user_id = auth.uid() AND (up.role = 'admin' OR cr.name = 'admin')
    )
  );

CREATE POLICY "Admins can update all merchant profiles" ON public.merchant_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      LEFT JOIN public.custom_roles cr ON up.custom_role_id = cr.id
      WHERE up.user_id = auth.uid() AND (up.role = 'admin' OR cr.name = 'admin')
    )
  );

CREATE POLICY "Admins can insert merchant profiles" ON public.merchant_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      LEFT JOIN public.custom_roles cr ON up.custom_role_id = cr.id
      WHERE up.user_id = auth.uid() AND (up.role = 'admin' OR cr.name = 'admin')
    )
  );

CREATE POLICY "Admins can delete merchant profiles" ON public.merchant_profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      LEFT JOIN public.custom_roles cr ON up.custom_role_id = cr.id
      WHERE up.user_id = auth.uid() AND (up.role = 'admin' OR cr.name = 'admin')
    )
  );

-- Add performance indexes for merchant_profiles
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_business_name ON public.merchant_profiles(business_name);
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_full_name ON public.merchant_profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_business_phone ON public.merchant_profiles(business_phone);
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_email ON public.merchant_profiles(email);
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_status_combo ON public.merchant_profiles(approval_status, verification_status);

-- Add computed columns for merchant stats
ALTER TABLE public.merchant_profiles 
ADD COLUMN IF NOT EXISTS total_study_halls INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_revenue NUMERIC(10,2) DEFAULT 0.00;

-- Create function to update merchant stats
CREATE OR REPLACE FUNCTION update_merchant_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total study halls count
  UPDATE public.merchant_profiles 
  SET total_study_halls = (
    SELECT COUNT(*) FROM public.study_halls 
    WHERE merchant_id = NEW.merchant_id OR merchant_id = OLD.merchant_id
  )
  WHERE id = COALESCE(NEW.merchant_id, OLD.merchant_id);
  
  -- Update total revenue
  UPDATE public.merchant_profiles 
  SET total_revenue = (
    SELECT COALESCE(SUM(sh.total_revenue), 0) 
    FROM public.study_halls sh 
    WHERE sh.merchant_id = COALESCE(NEW.merchant_id, OLD.merchant_id)
  )
  WHERE id = COALESCE(NEW.merchant_id, OLD.merchant_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update merchant stats
DROP TRIGGER IF EXISTS update_merchant_stats_on_study_halls ON public.study_halls;
CREATE TRIGGER update_merchant_stats_on_study_halls
  AFTER INSERT OR UPDATE OR DELETE ON public.study_halls
  FOR EACH ROW EXECUTE FUNCTION update_merchant_stats();
