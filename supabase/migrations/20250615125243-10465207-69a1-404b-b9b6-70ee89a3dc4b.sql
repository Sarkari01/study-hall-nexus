
-- Create enum for default system roles
CREATE TYPE public.system_role AS ENUM ('super_admin', 'admin', 'moderator', 'editor', 'viewer');

-- Create custom roles table
CREATE TABLE public.custom_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_system_role BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create permissions table
CREATE TABLE public.permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  module TEXT NOT NULL, -- students, merchants, study_halls, payments, etc.
  action TEXT NOT NULL, -- read, write, delete, export, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create role permissions junction table
CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID REFERENCES public.custom_roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.custom_roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, role_id)
);

-- Enable RLS on all tables
ALTER TABLE public.custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for custom_roles
CREATE POLICY "Admins can manage custom roles" ON public.custom_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.custom_roles cr ON ur.role_id = cr.id 
      WHERE ur.user_id = auth.uid() AND cr.name IN ('super_admin', 'admin')
    )
  );

-- Create RLS policies for permissions
CREATE POLICY "Admins can view permissions" ON public.permissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.custom_roles cr ON ur.role_id = cr.id 
      WHERE ur.user_id = auth.uid() AND cr.name IN ('super_admin', 'admin')
    )
  );

-- Create RLS policies for role_permissions
CREATE POLICY "Admins can manage role permissions" ON public.role_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.custom_roles cr ON ur.role_id = cr.id 
      WHERE ur.user_id = auth.uid() AND cr.name IN ('super_admin', 'admin')
    )
  );

-- Create RLS policies for user_roles
CREATE POLICY "Admins can manage user roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      JOIN public.custom_roles cr ON ur.role_id = cr.id 
      WHERE ur.user_id = auth.uid() AND cr.name IN ('super_admin', 'admin')
    )
  );

-- Insert default system roles
INSERT INTO public.custom_roles (name, description, color, is_system_role) VALUES
('super_admin', 'Full system access with all permissions', '#DC2626', TRUE),
('admin', 'Administrative access to most features', '#7C3AED', TRUE),
('moderator', 'Content moderation and user management', '#059669', TRUE),
('editor', 'Content creation and editing permissions', '#EA580C', TRUE),
('viewer', 'Read-only access to most features', '#6B7280', TRUE);

-- Insert default permissions
INSERT INTO public.permissions (name, description, module, action) VALUES
-- Students module
('students.read', 'View students list and details', 'students', 'read'),
('students.write', 'Create and edit student records', 'students', 'write'),
('students.delete', 'Delete student records', 'students', 'delete'),
('students.export', 'Export student data', 'students', 'export'),

-- Merchants module
('merchants.read', 'View merchants list and details', 'merchants', 'read'),
('merchants.write', 'Create and edit merchant records', 'merchants', 'write'),
('merchants.delete', 'Delete merchant records', 'merchants', 'delete'),
('merchants.approve', 'Approve merchant applications', 'merchants', 'approve'),

-- Study Halls module
('study_halls.read', 'View study halls', 'study_halls', 'read'),
('study_halls.write', 'Create and edit study halls', 'study_halls', 'write'),
('study_halls.delete', 'Delete study halls', 'study_halls', 'delete'),

-- Payments module
('payments.read', 'View payment transactions', 'payments', 'read'),
('payments.process', 'Process payments and refunds', 'payments', 'process'),
('payments.export', 'Export payment data', 'payments', 'export'),

-- Reports module
('reports.read', 'View reports and analytics', 'reports', 'read'),
('reports.export', 'Export reports', 'reports', 'export'),

-- Settings module
('settings.read', 'View system settings', 'settings', 'read'),
('settings.write', 'Modify system settings', 'settings', 'write'),

-- User Management
('users.read', 'View user accounts', 'users', 'read'),
('users.write', 'Create and edit user accounts', 'users', 'write'),
('users.roles', 'Manage user roles and permissions', 'users', 'roles');

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION public.user_has_permission(user_id UUID, permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = user_id 
      AND p.name = permission_name 
      AND ur.is_active = TRUE
      AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  );
$$;

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id UUID)
RETURNS TABLE (
  permission_name TEXT,
  permission_description TEXT,
  module TEXT,
  action TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT DISTINCT p.name, p.description, p.module, p.action
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON ur.role_id = rp.role_id
  JOIN public.permissions p ON rp.permission_id = p.id
  WHERE ur.user_id = user_id 
    AND ur.is_active = TRUE
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW());
$$;
