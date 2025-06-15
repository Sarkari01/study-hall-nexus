
-- Insert basic permissions for user management
INSERT INTO public.permissions (name, description, module, action) VALUES
('users.roles', 'Manage user roles and permissions', 'users', 'roles'),
('users.read', 'View users', 'users', 'read'),
('users.write', 'Create and edit users', 'users', 'write'),
('students.read', 'View students', 'students', 'read'),
('students.write', 'Manage students', 'students', 'write'),
('merchants.read', 'View merchants', 'merchants', 'read'),
('merchants.write', 'Manage merchants', 'merchants', 'write'),
('payments.read', 'View payments', 'payments', 'read'),
('payments.write', 'Manage payments', 'payments', 'write'),
('payments.process', 'Process payments', 'payments', 'process'),
('payments.export', 'Export payment data', 'payments', 'export'),
('study_halls.read', 'View study halls', 'study_halls', 'read'),
('study_halls.write', 'Manage study halls', 'study_halls', 'write'),
('reports.read', 'View reports', 'reports', 'read'),
('reports.export', 'Export reports', 'reports', 'export'),
('settings.write', 'Manage system settings', 'settings', 'write')
ON CONFLICT (name) DO NOTHING;

-- Create a super admin role
INSERT INTO public.custom_roles (name, description, color, is_system_role) VALUES
('super_admin', 'Super Administrator with full access', '#EF4444', true)
ON CONFLICT (name) DO NOTHING;

-- Get the super admin role ID and assign all permissions to it
DO $$
DECLARE
    role_id uuid;
    perm_record RECORD;
BEGIN
    -- Get the super admin role ID
    SELECT id INTO role_id FROM public.custom_roles WHERE name = 'super_admin';
    
    -- Assign all permissions to super admin
    FOR perm_record IN SELECT id FROM public.permissions LOOP
        INSERT INTO public.role_permissions (role_id, permission_id) 
        VALUES (role_id, perm_record.id)
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;
