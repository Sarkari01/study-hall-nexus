
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RoleManagementHeader userCount={users.length} />

      <RoleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />

      <Card>
        <CardHeader>
          <CardTitle>Users & Roles</CardTitle>
        </CardHeader>
        <CardContent>
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
