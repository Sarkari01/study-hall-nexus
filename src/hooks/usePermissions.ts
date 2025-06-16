
import { useAuth } from '@/contexts/AuthContext';

export const usePermissions = () => {
  const { permissions, hasPermission, hasRole, userRole } = useAuth();

  const can = {
    // Admin permissions
    viewAllUsers: () => hasPermission('admin.users.view'),
    createUsers: () => hasPermission('admin.users.create'),
    editUsers: () => hasPermission('admin.users.edit'),
    deleteUsers: () => hasPermission('admin.users.delete'),
    accessSystemSettings: () => hasPermission('admin.system.settings'),
    manageRoles: () => hasPermission('admin.roles.manage'),

    // Merchant permissions
    viewStudyHalls: () => hasPermission('merchant.study_halls.view'),
    createStudyHalls: () => hasPermission('merchant.study_halls.create'),
    editStudyHalls: () => hasPermission('merchant.study_halls.edit'),
    deleteStudyHalls: () => hasPermission('merchant.study_halls.delete'),
    viewBookings: () => hasPermission('merchant.bookings.view') || hasPermission('student.bookings.view'),
    manageBookings: () => hasPermission('merchant.bookings.manage') || hasPermission('incharge.bookings.manage'),
    viewAnalytics: () => hasPermission('merchant.analytics.view'),
    assignIncharge: () => hasPermission('merchant.incharge.assign'),

    // Incharge permissions
    allocateSeats: () => hasPermission('incharge.seats.allocate'),
    manageCheckIn: () => hasPermission('incharge.checkin.manage'),
    viewHall: () => hasPermission('incharge.hall.view'),

    // Telecaller permissions
    viewLeads: () => hasPermission('telecaller.leads.view'),
    editLeads: () => hasPermission('telecaller.leads.edit'),
    updateBookingStatus: () => hasPermission('telecaller.bookings.status'),

    // Editor permissions
    manageBanners: () => hasPermission('editor.banners.manage'),
    manageContent: () => hasPermission('editor.content.manage'),
    manageNews: () => hasPermission('editor.news.manage'),

    // Student permissions
    createBookings: () => hasPermission('student.bookings.create'),
    viewSeats: () => hasPermission('student.seats.view'),
    participateInCommunity: () => hasPermission('student.community.participate'),
  };

  const is = {
    admin: () => hasRole('admin'),
    merchant: () => hasRole('merchant'),
    incharge: () => hasRole('incharge'),
    telecaller: () => hasRole('telecaller'),
    editor: () => hasRole('editor'),
    student: () => hasRole('student'),
  };

  return {
    permissions,
    hasPermission,
    hasRole,
    userRole,
    can,
    is,
  };
};
