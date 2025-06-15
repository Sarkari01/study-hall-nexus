
-- Create merchant_profiles table for comprehensive merchant information
CREATE TABLE IF NOT EXISTS public.merchant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  -- Business Details (Required)
  business_name TEXT NOT NULL,
  business_phone TEXT NOT NULL,
  business_logo_url TEXT,
  slide_images TEXT[] DEFAULT '{}',
  business_address JSONB NOT NULL, -- {street, city, state, postal_code, country}
  trade_license_url TEXT,
  
  -- Merchant Financial Details (Optional)
  refundable_security_deposit DECIMAL(10,2) DEFAULT 0,
  
  -- Merchant Identity Details
  aadhaar_card_url TEXT,
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  communication_address JSONB, -- {street, city, state, postal_code, country}
  
  -- Bank Account Details
  bank_account_details JSONB, -- {account_number, ifsc_code, bank_name, account_holder_name}
  
  -- Status and metadata
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'suspended')),
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create merchant_documents table for document management
CREATE TABLE IF NOT EXISTS public.merchant_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchant_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'trade_license', 'aadhaar_card', 'bank_statement', etc.
  document_url TEXT NOT NULL,
  document_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.merchant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for merchant_profiles
CREATE POLICY "Merchants can view their own profile" ON public.merchant_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Merchants can update their own profile" ON public.merchant_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Merchants can insert their own profile" ON public.merchant_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all merchant profiles" ON public.merchant_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all merchant profiles" ON public.merchant_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert merchant profiles" ON public.merchant_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for merchant_documents
CREATE POLICY "Merchants can view their own documents" ON public.merchant_documents
  FOR SELECT USING (
    merchant_id IN (
      SELECT id FROM public.merchant_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can insert their own documents" ON public.merchant_documents
  FOR INSERT WITH CHECK (
    merchant_id IN (
      SELECT id FROM public.merchant_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update their own documents" ON public.merchant_documents
  FOR UPDATE USING (
    merchant_id IN (
      SELECT id FROM public.merchant_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all merchant documents" ON public.merchant_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all merchant documents" ON public.merchant_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_user_id ON public.merchant_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_approval_status ON public.merchant_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_merchant_documents_merchant_id ON public.merchant_documents(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_documents_type ON public.merchant_documents(document_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_merchant_profiles_updated_at 
  BEFORE UPDATE ON public.merchant_profiles 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_merchant_documents_updated_at 
  BEFORE UPDATE ON public.merchant_documents 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
