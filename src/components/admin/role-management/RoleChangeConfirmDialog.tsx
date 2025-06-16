
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Shield, AlertTriangle } from "lucide-react";
import { ValidRole, getRoleDisplayName } from "@/utils/roleValidation";

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: ValidRole | null;
}

interface RoleChangeConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRole | null;
  newRole: ValidRole;
  currentRole: ValidRole | null;
  onConfirm: () => void;
}

const RoleChangeConfirmDialog: React.FC<RoleChangeConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  user,
  newRole,
  currentRole,
  onConfirm
}) => {
  if (!user) return null;

  const isRoleUpgrade = currentRole && newRole ? 
    (newRole === 'admin' || (newRole === 'merchant' && currentRole !== 'admin')) : 
    false;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isRoleUpgrade ? (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            ) : (
              <Shield className="h-5 w-5 text-blue-500" />
            )}
            Confirm Role Change
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to change the role for <strong>{user.full_name}</strong> ({user.email}).
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Current Role:</p>
                <p className="font-medium">
                  {currentRole ? getRoleDisplayName(currentRole) : 'No Role'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">New Role:</p>
                <p className="font-medium text-blue-600">
                  {getRoleDisplayName(newRole)}
                </p>
              </div>
            </div>
          </div>
          
          {isRoleUpgrade && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Warning:</strong> You are granting elevated permissions. This user will have access to sensitive functions.
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirm Role Change
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoleChangeConfirmDialog;
