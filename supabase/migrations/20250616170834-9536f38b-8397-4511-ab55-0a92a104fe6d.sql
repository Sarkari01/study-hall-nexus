
-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.custom_roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Insert core permissions for all modules
INSERT INTO public.permissions (name, description, module, action) VALUES
-- Admin permissions
('admin.users.view', 'View all users', 'users', 'view'),
('admin.users.create', 'Create new users', 'users', 'create'),
('admin.users.edit', 'Edit user details', 'users', 'edit'),
('admin.users.delete', 'Delete users', 'users', 'delete'),
('admin.system.settings', 'Access system settings', 'system', 'settings'),
('admin.roles.manage', 'Manage roles and permissions', 'roles', 'manage'),

-- Merchant permissions
('merchant.study_halls.view', 'View own study halls', 'study_halls', 'view'),
('merchant.study_halls.create', 'Create study halls', 'study_halls', 'create'),
('merchant.study_halls.edit', 'Edit own study halls', 'study_halls', 'edit'),
('merchant.study_halls.delete', 'Delete own study halls', 'study_halls', 'delete'),
('merchant.bookings.view', 'View own bookings', 'bookings', 'view'),
('merchant.bookings.manage', 'Manage own bookings', 'bookings', 'manage'),
('merchant.analytics.view', 'View own analytics', 'analytics', 'view'),
('merchant.incharge.assign', 'Assign incharge roles', 'incharge', 'assign'),

-- Incharge permissions
('incharge.bookings.manage', 'Manage hall bookings', 'bookings', 'manage'),
('incharge.seats.allocate', 'Allocate seats', 'seats', 'allocate'),
('incharge.checkin.manage', 'Manage check-ins/outs', 'checkin', 'manage'),
('incharge.hall.view', 'View assigned hall', 'hall', 'view'),

-- Telecaller permissions
('telecaller.leads.view', 'View assigned leads', 'leads', 'view'),
('telecaller.leads.edit', 'Edit lead status', 'leads', 'edit'),
('telecaller.bookings.status', 'Update booking status', 'bookings', 'status'),

-- Editor permissions
('editor.banners.manage', 'Manage banners', 'banners', 'manage'),
('editor.content.manage', 'Manage site content', 'content', 'manage'),
('editor.news.manage', 'Manage news', 'news', 'manage'),

-- Student permissions
('student.bookings.create', 'Create bookings', 'bookings', 'create'),
('student.bookings.view', 'View own bookings', 'bookings', 'view'),
('student.seats.view', 'View seat layouts', 'seats', 'view'),
('student.community.participate', 'Participate in community', 'community', 'participate')

ON CONFLICT (name) DO NOTHING;

-- Create default system roles
INSERT INTO public.custom_roles (name, description, is_system_role) VALUES
('admin', 'System Administrator with full access', true),
('merchant', 'Study hall owner/manager', true),
('incharge', 'Hall manager assigned by merchant', true),
('telecaller', 'Sales representative for lead management', true),
('editor', 'Content manager for banners and news', true),
('student', 'Platform user who books study halls', true)
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to default roles
WITH role_permissions_data AS (
  SELECT 
    r.id as role_id,
    p.id as permission_id
  FROM public.custom_roles r
  CROSS JOIN public.permissions p
  WHERE 
    (r.name = 'admin') OR
    (r.name = 'merchant' AND p.name LIKE 'merchant.%') OR
    (r.name = 'incharge' AND p.name LIKE 'incharge.%') OR
    (r.name = 'telecaller' AND p.name LIKE 'telecaller.%') OR
    (r.name = 'editor' AND p.name LIKE 'editor.%') OR
    (r.name = 'student' AND p.name LIKE 'student.%')
)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT role_id, permission_id FROM role_permissions_data
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can view permissions" ON public.permissions
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view role permissions" ON public.role_permissions
FOR SELECT TO authenticated USING (true);

-- Create updated_at trigger for permissions
CREATE TRIGGER update_permissions_updated_at
  BEFORE UPDATE ON public.permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update user_profiles table to support role assignment
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS custom_role_id UUID REFERENCES public.custom_roles(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_custom_role_id ON public.user_profiles(custom_role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
