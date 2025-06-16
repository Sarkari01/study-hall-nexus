
-- Remove unnecessary roles from custom_roles table
DELETE FROM public.custom_roles 
WHERE name IN ('super_admin', 'moderator', 'viewer');

-- Clean up any orphaned role_permissions for deleted roles
DELETE FROM public.role_permissions 
WHERE role_id NOT IN (SELECT id FROM public.custom_roles);

-- Clean up any orphaned user_roles for deleted roles
DELETE FROM public.user_roles 
WHERE role_id NOT IN (SELECT id FROM public.custom_roles);

-- Verify we only have the 6 intended roles
-- This query should return exactly 6 roles: admin, merchant, student, editor, incharge, telecaller
SELECT name, description, is_system_role 
FROM public.custom_roles 
ORDER BY name;
