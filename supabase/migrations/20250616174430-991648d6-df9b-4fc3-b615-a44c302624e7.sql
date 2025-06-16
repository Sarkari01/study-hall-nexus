
-- Create missing system roles
INSERT INTO public.custom_roles (name, description, is_system_role, color) VALUES
('student', 'Student role with booking and community access', true, '#10B981'),
('merchant', 'Merchant role with study hall management access', true, '#3B82F6'),
('telecaller', 'Telecaller role with lead management access', true, '#F59E0B'),
('incharge', 'Incharge role with hall operations access', true, '#8B5CF6')
ON CONFLICT (name) DO NOTHING;

-- Create permissions for each role
INSERT INTO public.permissions (name, description, module, action) VALUES
-- Student permissions
('student.bookings.create', 'Create new bookings', 'bookings', 'create'),
('student.bookings.view', 'View own bookings', 'bookings', 'view'),
('student.seats.view', 'View available seats', 'seats', 'view'),
('student.community.participate', 'Participate in community discussions', 'community', 'participate'),

-- Merchant permissions  
('merchant.study_halls.view', 'View study halls', 'study_halls', 'view'),
('merchant.study_halls.create', 'Create study halls', 'study_halls', 'create'),
('merchant.study_halls.edit', 'Edit study halls', 'study_halls', 'edit'),
('merchant.study_halls.delete', 'Delete study halls', 'study_halls', 'delete'),
('merchant.bookings.view', 'View bookings', 'bookings', 'view'),
('merchant.bookings.manage', 'Manage bookings', 'bookings', 'manage'),
('merchant.analytics.view', 'View analytics', 'analytics', 'view'),
('merchant.incharge.assign', 'Assign incharge', 'incharge', 'assign'),

-- Admin permissions
('admin.users.view', 'View all users', 'users', 'view'),
('admin.users.create', 'Create users', 'users', 'create'),
('admin.users.edit', 'Edit users', 'users', 'edit'),
('admin.users.delete', 'Delete users', 'users', 'delete'),
('admin.system.settings', 'Access system settings', 'system', 'settings'),
('admin.roles.manage', 'Manage roles and permissions', 'roles', 'manage'),

-- Telecaller permissions
('telecaller.leads.view', 'View leads', 'leads', 'view'),
('telecaller.leads.edit', 'Edit leads', 'leads', 'edit'),
('telecaller.bookings.status', 'Update booking status', 'bookings', 'status'),

-- Incharge permissions
('incharge.seats.allocate', 'Allocate seats', 'seats', 'allocate'),
('incharge.checkin.manage', 'Manage check-in/check-out', 'checkin', 'manage'),
('incharge.hall.view', 'View hall operations', 'hall', 'view'),
('incharge.bookings.manage', 'Manage hall bookings', 'bookings', 'manage'),

-- Editor permissions
('editor.banners.manage', 'Manage banners', 'banners', 'manage'),
('editor.content.manage', 'Manage content', 'content', 'manage'),
('editor.news.manage', 'Manage news', 'news', 'manage')
ON CONFLICT (name) DO NOTHING;

-- Link permissions to roles
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM public.custom_roles r, public.permissions p
WHERE (
  (r.name = 'student' AND p.name IN ('student.bookings.create', 'student.bookings.view', 'student.seats.view', 'student.community.participate'))
  OR
  (r.name = 'merchant' AND p.name IN ('merchant.study_halls.view', 'merchant.study_halls.create', 'merchant.study_halls.edit', 'merchant.study_halls.delete', 'merchant.bookings.view', 'merchant.bookings.manage', 'merchant.analytics.view', 'merchant.incharge.assign'))
  OR
  (r.name = 'admin' AND p.name IN ('admin.users.view', 'admin.users.create', 'admin.users.edit', 'admin.users.delete', 'admin.system.settings', 'admin.roles.manage'))
  OR
  (r.name = 'telecaller' AND p.name IN ('telecaller.leads.view', 'telecaller.leads.edit', 'telecaller.bookings.status'))
  OR
  (r.name = 'incharge' AND p.name IN ('incharge.seats.allocate', 'incharge.checkin.manage', 'incharge.hall.view', 'incharge.bookings.manage'))
  OR
  (r.name = 'editor' AND p.name IN ('editor.banners.manage', 'editor.content.manage', 'editor.news.manage'))
)
ON CONFLICT (role_id, permission_id) DO NOTHING;
