
-- Create permissions table with basic permissions for all roles
CREATE TABLE IF NOT EXISTS public.permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  module text NOT NULL,
  action text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id uuid NOT NULL REFERENCES public.custom_roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Insert basic permissions for all modules
INSERT INTO public.permissions (name, description, module, action) VALUES 
-- Admin permissions
('admin.users.view', 'View all users', 'admin', 'view'),
('admin.users.create', 'Create new users', 'admin', 'create'),
('admin.users.edit', 'Edit user details', 'admin', 'edit'),
('admin.users.delete', 'Delete users', 'admin', 'delete'),
('admin.system.settings', 'Access system settings', 'admin', 'manage'),
('admin.roles.manage', 'Manage user roles', 'admin', 'manage'),

-- Merchant permissions
('merchant.study_halls.view', 'View study halls', 'merchant', 'view'),
('merchant.study_halls.create', 'Create study halls', 'merchant', 'create'),
('merchant.study_halls.edit', 'Edit study halls', 'merchant', 'edit'),
('merchant.study_halls.delete', 'Delete study halls', 'merchant', 'delete'),
('merchant.bookings.view', 'View bookings', 'merchant', 'view'),
('merchant.bookings.manage', 'Manage bookings', 'merchant', 'manage'),
('merchant.analytics.view', 'View analytics', 'merchant', 'view'),
('merchant.incharge.assign', 'Assign incharge', 'merchant', 'assign'),

-- Student permissions
('student.bookings.create', 'Create bookings', 'student', 'create'),
('student.bookings.view', 'View own bookings', 'student', 'view'),
('student.seats.view', 'View seat availability', 'student', 'view'),
('student.community.participate', 'Participate in community', 'student', 'participate'),

-- Incharge permissions
('incharge.seats.allocate', 'Allocate seats', 'incharge', 'allocate'),
('incharge.checkin.manage', 'Manage check-in/out', 'incharge', 'manage'),
('incharge.hall.view', 'View hall operations', 'incharge', 'view'),
('incharge.bookings.manage', 'Manage hall bookings', 'incharge', 'manage'),

-- Telecaller permissions
('telecaller.leads.view', 'View leads', 'telecaller', 'view'),
('telecaller.leads.edit', 'Edit leads', 'telecaller', 'edit'),
('telecaller.bookings.status', 'Update booking status', 'telecaller', 'update'),

-- Editor permissions
('editor.banners.manage', 'Manage banners', 'editor', 'manage'),
('editor.content.manage', 'Manage content', 'editor', 'manage'),
('editor.news.manage', 'Manage news', 'editor', 'manage')
ON CONFLICT (name) DO NOTHING;

-- Get role IDs for permission assignment
DO $$
DECLARE
    admin_role_id uuid;
    merchant_role_id uuid;
    student_role_id uuid;
    incharge_role_id uuid;
    telecaller_role_id uuid;
    editor_role_id uuid;
BEGIN
    -- Get role IDs
    SELECT id INTO admin_role_id FROM public.custom_roles WHERE name = 'admin' AND is_system_role = true;
    SELECT id INTO merchant_role_id FROM public.custom_roles WHERE name = 'merchant' AND is_system_role = true;
    SELECT id INTO student_role_id FROM public.custom_roles WHERE name = 'student' AND is_system_role = true;
    SELECT id INTO incharge_role_id FROM public.custom_roles WHERE name = 'incharge' AND is_system_role = true;
    SELECT id INTO telecaller_role_id FROM public.custom_roles WHERE name = 'telecaller' AND is_system_role = true;
    SELECT id INTO editor_role_id FROM public.custom_roles WHERE name = 'editor' AND is_system_role = true;
    
    -- Assign admin permissions
    IF admin_role_id IS NOT NULL THEN
        INSERT INTO public.role_permissions (role_id, permission_id)
        SELECT admin_role_id, p.id FROM public.permissions p
        WHERE p.module = 'admin'
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Assign merchant permissions
    IF merchant_role_id IS NOT NULL THEN
        INSERT INTO public.role_permissions (role_id, permission_id)
        SELECT merchant_role_id, p.id FROM public.permissions p
        WHERE p.module = 'merchant'
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Assign student permissions
    IF student_role_id IS NOT NULL THEN
        INSERT INTO public.role_permissions (role_id, permission_id)
        SELECT student_role_id, p.id FROM public.permissions p
        WHERE p.module = 'student'
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Assign incharge permissions
    IF incharge_role_id IS NOT NULL THEN
        INSERT INTO public.role_permissions (role_id, permission_id)
        SELECT incharge_role_id, p.id FROM public.permissions p
        WHERE p.module = 'incharge'
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Assign telecaller permissions
    IF telecaller_role_id IS NOT NULL THEN
        INSERT INTO public.role_permissions (role_id, permission_id)
        SELECT telecaller_role_id, p.id FROM public.permissions p
        WHERE p.module = 'telecaller'
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Assign editor permissions
    IF editor_role_id IS NOT NULL THEN
        INSERT INTO public.role_permissions (role_id, permission_id)
        SELECT editor_role_id, p.id FROM public.permissions p
        WHERE p.module = 'editor'
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies for permissions table
CREATE POLICY "Everyone can view permissions" ON public.permissions
FOR SELECT USING (true);

-- Create policies for role_permissions table
CREATE POLICY "Everyone can view role permissions" ON public.role_permissions
FOR SELECT USING (true);
