
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidRole } from "@/utils/roleValidation";
import { usePermissions } from "@/hooks/usePermissions";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { useRoleAudit } from "@/hooks/useRoleAudit";
import { useAuth } from "@/contexts/AuthContext";
import RoleManagementHeader from "./role-management/RoleManagementHeader";
import RoleFilters from "./role-management/RoleFilters";
import UsersTable from "./role-management/UsersTable";
import RoleAssignmentDialog from "./role-management/RoleAssignmentDialog";

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: ValidRole | null;
  created_at: string;
  last_sign_in_at: string;
}

const RoleManagement = () => {
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<ValidRole | ''>('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  const { roleManagement } = usePermissions();
  const { user } = useAuth();
  const { logRoleChange } = useRoleAudit();
  const {
    users,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    loading,
    assignRole,
    getAssignableRoles
  } = useRoleManagement();

  const handleManageUser = (user: UserWithRole) => {
    setSelectedUser(user);
    setNewRole(user.role || '');
    setIsAssignDialogOpen(true);
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !newRole || !user?.id) return;

    if (!roleManagement.canManageRole(newRole)) {
      return;
    }

    const oldRole = selectedUser.role;
    const success = await assignRole(selectedUser.id, newRole);
    
    if (success) {
      // Log the role change for audit purposes
      await logRoleChange({
        user_id: selectedUser.id,
        changed_by: user.id,
        old_role: oldRole,
        new_role: newRole
      });

      setIsAssignDialogOpen(false);
      setSelectedUser(null);
      setNewRole('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Role Management</h1>
        <p className="text-emerald-100">Manage user roles and permissions across the platform</p>
      </div>

      <RoleManagementHeader userCount={users.length} />

      <RoleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />

      <Card className="border-emerald-200 shadow-lg bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
          <CardTitle className="text-emerald-900 flex items-center gap-2">
            Users & Roles
            <span className="text-sm font-normal bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
              {users.length} Total
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <UsersTable
            users={users}
            onManageUser={handleManageUser}
          />
        </CardContent>
      </Card>

      <RoleAssignmentDialog
        isOpen={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        selectedUser={selectedUser}
        newRole={newRole}
        onRoleChange={setNewRole}
        onAssignRole={handleAssignRole}
        assignableRoles={getAssignableRoles()}
      />
    </div>
  );
};

export default RoleManagement;
