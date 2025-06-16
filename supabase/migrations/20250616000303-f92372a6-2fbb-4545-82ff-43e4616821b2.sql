
-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  billing_period TEXT NOT NULL CHECK (billing_period IN ('day', 'week', 'month', 'year')),
  validity_days INTEGER NOT NULL,
  features JSONB,
  max_study_halls INTEGER,
  max_cabins INTEGER,
  has_analytics BOOLEAN DEFAULT false,
  has_chat_support BOOLEAN DEFAULT false,
  auto_renew_enabled BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  is_trial BOOLEAN DEFAULT false,
  trial_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create merchant subscriptions table
CREATE TABLE public.merchant_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'suspended')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscription payments table for payment history
CREATE TABLE public.subscription_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES public.merchant_subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT,
  payment_gateway TEXT,
  gateway_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subscription tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (readable by all authenticated users, manageable by admins)
CREATE POLICY "Public can view active subscription plans" ON public.subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans
  FOR ALL USING (true);

-- RLS Policies for merchant_subscriptions (merchants can view their own, admins can manage all)
CREATE POLICY "Merchants can view their subscriptions" ON public.merchant_subscriptions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage merchant subscriptions" ON public.merchant_subscriptions
  FOR ALL USING (true);

-- RLS Policies for subscription_payments (merchants can view their own, admins can manage all)
CREATE POLICY "Users can view related payments" ON public.subscription_payments
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage subscription payments" ON public.subscription_payments
  FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_subscription_plans_active ON public.subscription_plans(is_active);
CREATE INDEX idx_merchant_subscriptions_merchant ON public.merchant_subscriptions(merchant_id);
CREATE INDEX idx_merchant_subscriptions_status ON public.merchant_subscriptions(status);
CREATE INDEX idx_subscription_payments_subscription ON public.subscription_payments(subscription_id);
CREATE INDEX idx_subscription_payments_status ON public.subscription_payments(status);

-- Create trigger to update updated_at column
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_merchant_subscriptions_updated_at
  BEFORE UPDATE ON public.merchant_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_payments_updated_at
  BEFORE UPDATE ON public.subscription_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample subscription plans
INSERT INTO public.subscription_plans (name, description, price, billing_period, validity_days, max_study_halls, max_cabins, has_analytics, has_chat_support) VALUES
('Basic Plan', 'Perfect for small study halls', 999.00, 'month', 30, 1, 10, false, false),
('Professional Plan', 'Ideal for growing businesses', 2499.00, 'month', 30, 5, 50, true, true),
('Enterprise Plan', 'For large study hall networks', 4999.00, 'month', 30, -1, -1, true, true),
('Trial Plan', 'Free trial for new merchants', 0.00, 'month', 7, 1, 5, false, false);

-- Update trial plan to be marked as trial
UPDATE public.subscription_plans SET is_trial = true, trial_days = 7 WHERE name = 'Trial Plan';
