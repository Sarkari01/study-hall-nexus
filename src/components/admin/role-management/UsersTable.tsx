
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2 } from "lucide-react";
import { ValidRole, getRoleDisplayName } from "@/utils/roleValidation";

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: ValidRole | null;
  created_at: string;
  last_sign_in_at: string;
}

interface UsersTableProps {
  users: UserWithRole[];
  onManageUser: (user: UserWithRole) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onManageUser }) => {
  const getRoleBadgeColor = (role: ValidRole | null) => {
    if (!role) return 'bg-gray-100 text-gray-800';
    const colors: Record<ValidRole, string> = {
      admin: 'bg-red-100 text-red-800',
      merchant: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800',
      editor: 'bg-purple-100 text-purple-800',
      telecaller: 'bg-yellow-100 text-yellow-800',
      incharge: 'bg-indigo-100 text-indigo-800'
    };
    return colors[role];
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Current Role</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Last Active</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="font-medium">{user.full_name}</div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {user.role ? (
                <Badge className={getRoleBadgeColor(user.role)}>
                  {getRoleDisplayName(user.role)}
                </Badge>
              ) : (
                <Badge variant="outline">No Role</Badge>
              )}
            </TableCell>
            <TableCell>
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </TableCell>
            <TableCell>
              {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onManageUser(user)}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Manage
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
