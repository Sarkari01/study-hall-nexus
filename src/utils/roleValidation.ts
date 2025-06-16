
// Valid system roles after cleanup
export const VALID_ROLES = [
  'admin',
  'merchant', 
  'student',
  'editor',
  'incharge',
  'telecaller'
] as const;

export type ValidRole = typeof VALID_ROLES[number];

// Role hierarchy for access control
export const ROLE_HIERARCHY = {
  admin: 100,      // Highest level - can manage all roles
  merchant: 50,    // Can manage incharge
  editor: 40,      // Can manage content
  telecaller: 30,  // Can manage leads and calls
  incharge: 20,    // Can manage study hall operations
  student: 10      // Basic user level
} as const;

// Validate if a role is valid
export const isValidRole = (role: string): role is ValidRole => {
  return VALID_ROLES.includes(role as ValidRole);
};

// Get role level for hierarchy checks
export const getRoleLevel = (role: string): number => {
  if (!isValidRole(role)) return 0;
  return ROLE_HIERARCHY[role];
};

// Check if user role can manage target role
export const canManageRole = (userRole: string, targetRole: string): boolean => {
  const userLevel = getRoleLevel(userRole);
  const targetLevel = getRoleLevel(targetRole);
  return userLevel > targetLevel;
};

// Get available roles for a user to assign (based on their level)
export const getAssignableRoles = (userRole: string): ValidRole[] => {
  const userLevel = getRoleLevel(userRole);
  return VALID_ROLES.filter(role => getRoleLevel(role) < userLevel);
};
