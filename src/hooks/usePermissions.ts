
import { useAuth } from '@/contexts/AuthContext';
import { isValidRole, canManageRole } from '@/utils/roleValidation';

export const usePermissions = () => {
  const { permissions, hasPermission, hasRole, userRole } = useAuth();

  // Admin users have full access to everything
  const isAdmin = userRole?.name === 'admin';

  const can = {
    // Admin permissions - full access
    viewAllUsers: () => isAdmin || hasPermission('admin.users.view'),
    createUsers: () => isAdmin || hasPermission('admin.users.create'),
    editUsers: () => isAdmin || hasPermission('admin.users.edit'),
    deleteUsers: () => isAdmin || hasPermission('admin.users.delete'),
    accessSystemSettings: () => isAdmin || hasPermission('admin.system.settings'),
    manageRoles: () => isAdmin || hasPermission('admin.roles.manage'),

    // Merchant permissions - admin has full access
    viewStudyHalls: () => isAdmin || hasPermission('merchant.study_halls.view'),
    createStudyHalls: () => isAdmin || hasPermission('merchant.study_halls.create'),
    editStudyHalls: () => isAdmin || hasPermission('merchant.study_halls.edit'),
    deleteStudyHalls: () => isAdmin || hasPermission('merchant.study_halls.delete'),
    viewBookings: () => isAdmin || hasPermission('merchant.bookings.view') || hasPermission('student.bookings.view'),
    manageBookings: () => isAdmin || hasPermission('merchant.bookings.manage') || hasPermission('incharge.bookings.manage'),
    viewAnalytics: () => isAdmin || hasPermission('merchant.analytics.view'),
    assignIncharge: () => isAdmin || hasPermission('merchant.incharge.assign'),

    // Incharge permissions - admin has full access
    allocateSeats: () => isAdmin || hasPermission('incharge.seats.allocate'),
    manageCheckIn: () => isAdmin || hasPermission('incharge.checkin.manage'),
    viewHall: () => isAdmin || hasPermission('incharge.hall.view'),

    // Telecaller permissions - admin has full access
    viewLeads: () => isAdmin || hasPermission('telecaller.leads.view'),
    editLeads: () => isAdmin || hasPermission('telecaller.leads.edit'),
    updateBookingStatus: () => isAdmin || hasPermission('telecaller.bookings.status'),

    // Editor permissions - admin has full access
    manageBanners: () => isAdmin || hasPermission('editor.banners.manage'),
    manageContent: () => isAdmin || hasPermission('editor.content.manage'),
    manageNews: () => isAdmin || hasPermission('editor.news.manage'),

    // Student permissions - admin has full access
    createBookings: () => isAdmin || hasPermission('student.bookings.create'),
    viewSeats: () => isAdmin || hasPermission('student.seats.view'),
    participateInCommunity: () => isAdmin || hasPermission('student.community.participate'),

    // Additional admin-specific permissions
    viewAllData: () => isAdmin,
    manageAllSettings: () => isAdmin,
    accessAllFeatures: () => isAdmin,
    viewAllReports: () => isAdmin,
    manageAllTransactions: () => isAdmin,
    manageSystemConfiguration: () => isAdmin,
  };

  const is = {
    admin: () => hasRole('admin'),
    merchant: () => hasRole('merchant'),
    incharge: () => hasRole('incharge'),
    telecaller: () => hasRole('telecaller'),
    editor: () => hasRole('editor'),
    student: () => hasRole('student'),
  };

  // Enhanced permission helper specifically for admin
  const adminPermissions = {
    hasFullAccess: () => isAdmin,
    canAccessAnyFeature: () => isAdmin,
    canManageAnyUser: () => isAdmin,
    canViewAnyData: () => isAdmin,
    canModifySystemSettings: () => isAdmin,
  };

  // Role management helpers using the validation utils
  const roleManagement = {
    canManageRole: (targetRole: string) => {
      if (!userRole?.name) return false;
      // Admin can manage all roles
      if (isAdmin) return true;
      return canManageRole(userRole.name, targetRole);
    },
    isValidRole: (role: string) => isValidRole(role),
    hasValidRole: () => userRole?.name ? isValidRole(userRole.name) : false
  };

  // Enhanced hasPermission function for admin
  const enhancedHasPermission = (permission: string): boolean => {
    // Admin has all permissions
    if (isAdmin) return true;
    return hasPermission(permission);
  };

  return {
    permissions,
    hasPermission: enhancedHasPermission,
    hasRole,
    userRole,
    can,
    is,
    roleManagement,
    adminPermissions,
    isAdmin,
  };
};
