
-- Database Finalization Script for Sarkari Ninja Platform
-- This script ensures all required tables, columns, and relationships are in place

-- Create missing tables for subscription management
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    duration_months INTEGER NOT NULL DEFAULT 1,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    max_study_halls INTEGER,
    max_bookings_per_day INTEGER,
    priority_support BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES user_profiles(user_id)
);

CREATE TABLE IF NOT EXISTS merchant_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchant_profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    amount_paid NUMERIC(10, 2),
    payment_method TEXT,
    auto_renewal BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES user_profiles(user_id)
);

-- Create study halls table
CREATE TABLE IF NOT EXISTS study_halls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchant_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    address JSONB NOT NULL,
    contact_number TEXT,
    email TEXT,
    total_seats INTEGER NOT NULL DEFAULT 0,
    available_seats INTEGER NOT NULL DEFAULT 0,
    hourly_rate NUMERIC(10, 2) NOT NULL,
    daily_rate NUMERIC(10, 2),
    monthly_rate NUMERIC(10, 2),
    amenities JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    operating_hours JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    qr_code_url TEXT,
    wifi_password TEXT,
    rules_and_policies TEXT,
    location_coordinates JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES user_profiles(user_id),
    approved_by UUID REFERENCES user_profiles(user_id),
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    study_hall_id UUID REFERENCES study_halls(id) ON DELETE CASCADE,
    booking_type TEXT NOT NULL CHECK (booking_type IN ('hourly', 'daily', 'monthly')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    seat_number TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    final_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT,
    payment_reference TEXT,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    qr_code_data TEXT,
    special_requests TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES user_profiles(user_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id),
    subscription_id UUID REFERENCES merchant_subscriptions(id),
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT NOT NULL,
    payment_gateway TEXT,
    gateway_transaction_id TEXT,
    gateway_payment_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    refund_amount NUMERIC(10, 2)
);

-- Create transactions table for detailed ledger
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id),
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT NOT NULL,
    reference_id TEXT,
    reference_type TEXT,
    balance_before NUMERIC(10, 2) NOT NULL DEFAULT 0,
    balance_after NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES user_profiles(user_id)
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    business_name TEXT,
    business_type TEXT,
    location JSONB,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'rejected')),
    notes TEXT,
    assigned_to UUID REFERENCES user_profiles(user_id),
    expected_revenue NUMERIC(10, 2),
    follow_up_date TIMESTAMP WITH TIME ZONE,
    converted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create locations table for geographic management
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('city', 'area', 'landmark')),
    parent_location_id UUID REFERENCES locations(id),
    coordinates JSONB,
    address_components JSONB,
    is_active BOOLEAN DEFAULT true,
    study_halls_count INTEGER DEFAULT 0,
    merchants_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES custom_roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    granted_by UUID REFERENCES user_profiles(user_id),
    UNIQUE(role_id, permission_id)
);

-- Create revenue tracking table
CREATE TABLE IF NOT EXISTS revenue_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    merchant_id UUID REFERENCES merchant_profiles(id),
    study_hall_id UUID REFERENCES study_halls(id),
    location_id UUID REFERENCES locations(id),
    booking_revenue NUMERIC(10, 2) DEFAULT 0,
    subscription_revenue NUMERIC(10, 2) DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    commission_earned NUMERIC(10, 2) DEFAULT 0,
    commission_rate NUMERIC(5, 2) DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(date, merchant_id, study_hall_id)
);

-- Create settlement/payout table
CREATE TABLE IF NOT EXISTS settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchant_profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    commission_amount NUMERIC(10, 2) NOT NULL,
    net_amount NUMERIC(10, 2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    payment_method TEXT,
    transaction_reference TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES user_profiles(user_id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by UUID REFERENCES user_profiles(user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_study_hall_id ON bookings(study_hall_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_halls_merchant_id ON study_halls(merchant_id);
CREATE INDEX IF NOT EXISTS idx_study_halls_is_active ON study_halls(is_active);
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_merchant_id ON merchant_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_subscriptions_status ON merchant_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_revenue_records_date ON revenue_records(date);
CREATE INDEX IF NOT EXISTS idx_revenue_records_merchant_id ON revenue_records(merchant_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, duration_months, features, max_study_halls, max_bookings_per_day, priority_support) 
VALUES 
    ('Basic', 'Perfect for small study halls', 999.00, 1, '["Basic listing", "Up to 50 seats", "Standard support"]'::jsonb, 1, 100, false),
    ('Premium', 'Ideal for growing businesses', 2499.00, 1, '["Premium listing", "Up to 200 seats", "Priority support", "Analytics dashboard"]'::jsonb, 3, 500, true),
    ('Enterprise', 'For large study hall chains', 4999.00, 1, '["Enterprise listing", "Unlimited seats", "24/7 support", "Advanced analytics", "Custom integrations"]'::jsonb, 10, 2000, true)
ON CONFLICT DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, description, module, action) VALUES
    ('manage_students', 'Manage student accounts and profiles', 'students', 'manage'),
    ('manage_merchants', 'Manage merchant accounts and verification', 'merchants', 'manage'),
    ('manage_study_halls', 'Manage study halls and bookings', 'study_halls', 'manage'),
    ('manage_payments', 'View and manage payments', 'payments', 'manage'),
    ('manage_subscriptions', 'Manage subscription plans and merchant subscriptions', 'subscriptions', 'manage'),
    ('manage_promotions', 'Manage coupons and reward rules', 'promotions', 'manage'),
    ('send_notifications', 'Send push notifications to users', 'notifications', 'send'),
    ('view_reports', 'View revenue reports and analytics', 'reports', 'view'),
    ('manage_settings', 'Manage system settings and configurations', 'settings', 'manage'),
    ('manage_developers', 'Manage developer access and API keys', 'developers', 'manage')
ON CONFLICT DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, category, is_public) VALUES
    ('platform_name', '"Sarkari Ninja"', 'Platform display name', 'branding', true),
    ('commission_rate', '10.0', 'Default commission rate percentage', 'business', false),
    ('booking_cancellation_hours', '24', 'Hours before booking start time to allow cancellation', 'booking', true),
    ('auto_settlement_enabled', 'true', 'Enable automatic settlement processing', 'payments', false),
    ('settlement_frequency', '"weekly"', 'How often to process settlements', 'payments', false),
    ('max_booking_duration_hours', '12', 'Maximum hours for a single booking', 'booking', true),
    ('student_wallet_enabled', 'true', 'Enable student wallet functionality', 'features', true),
    ('qr_code_enabled', 'true', 'Enable QR code check-in functionality', 'features', true),
    ('ai_features_enabled', 'true', 'Enable AI-powered features', 'features', false),
    ('maintenance_mode', 'false', 'Enable maintenance mode', 'system', false)
ON CONFLICT DO NOTHING;

-- Insert default roles
INSERT INTO custom_roles (name, description, is_system_role) VALUES
    ('Super Admin', 'Full system access with all permissions', true),
    ('Admin', 'Administrative access with most permissions', true),
    ('Moderator', 'Limited administrative access for content moderation', true),
    ('Support', 'Customer support access with read-only permissions', true)
ON CONFLICT DO NOTHING;

-- Update existing tables with missing columns if needed
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

ALTER TABLE merchant_profiles ADD COLUMN IF NOT EXISTS business_category TEXT;
ALTER TABLE merchant_profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE merchant_profiles ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}'::jsonb;
ALTER TABLE merchant_profiles ADD COLUMN IF NOT EXISTS operational_status TEXT DEFAULT 'active' CHECK (operational_status IN ('active', 'inactive', 'suspended'));

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at columns
DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_merchant_subscriptions_updated_at ON merchant_subscriptions;
CREATE TRIGGER update_merchant_subscriptions_updated_at BEFORE UPDATE ON merchant_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_study_halls_updated_at ON study_halls;
CREATE TRIGGER update_study_halls_updated_at BEFORE UPDATE ON study_halls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_revenue_records_updated_at ON revenue_records;
CREATE TRIGGER update_revenue_records_updated_at BEFORE UPDATE ON revenue_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settlements_updated_at ON settlements;
CREATE TRIGGER update_settlements_updated_at BEFORE UPDATE ON settlements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for security
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (can be customized based on requirements)
CREATE POLICY "Allow full access to authenticated users" ON subscription_plans FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON merchant_subscriptions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON study_halls FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON bookings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON payments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON transactions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON locations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON revenue_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON settlements FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow read access to public settings" ON system_settings FOR SELECT TO authenticated USING (is_public = true);
CREATE POLICY "Allow full access to system settings for admins" ON system_settings FOR ALL TO authenticated USING (true);

-- Add comments for documentation
COMMENT ON TABLE subscription_plans IS 'Subscription plans available for merchants';
COMMENT ON TABLE merchant_subscriptions IS 'Active and historical merchant subscriptions';
COMMENT ON TABLE study_halls IS 'Study halls registered by merchants';
COMMENT ON TABLE bookings IS 'Student bookings for study hall seats';
COMMENT ON TABLE payments IS 'Payment transactions for bookings and subscriptions';
COMMENT ON TABLE transactions IS 'Detailed transaction ledger for all financial activities';
COMMENT ON TABLE leads IS 'Potential merchant leads and their conversion status';
COMMENT ON TABLE locations IS 'Geographic locations for organizing study halls';
COMMENT ON TABLE revenue_records IS 'Daily revenue tracking and analytics';
COMMENT ON TABLE settlements IS 'Merchant payout settlements';
COMMENT ON TABLE system_settings IS 'Platform-wide configuration settings';
