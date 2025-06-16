
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";
import { ValidRole, getRoleDisplayName } from "@/utils/roleValidation";

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: ValidRole | null;
}

interface RoleAssignmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: UserWithRole | null;
  newRole: ValidRole | '';
  onRoleChange: (role: ValidRole) => void;
  onAssignRole: () => void;
  assignableRoles: ValidRole[];
}

const RoleAssignmentDialog: React.FC<RoleAssignmentDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedUser,
  newRole,
  onRoleChange,
  onAssignRole,
  assignableRoles
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Assign Role
          </DialogTitle>
          <DialogDescription>
            Assign a role to {selectedUser?.full_name} ({selectedUser?.email})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Role</label>
            <Select value={newRole} onValueChange={(value) => onRoleChange(value as ValidRole)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                {assignableRoles.map(role => (
                  <SelectItem key={role} value={role}>
                    {getRoleDisplayName(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {newRole && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{getRoleDisplayName(newRole as ValidRole)}</strong> role will be assigned to this user.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAssignRole} disabled={!newRole}>
            Assign Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleAssignmentDialog;
