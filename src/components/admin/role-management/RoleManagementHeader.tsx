
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface RoleManagementHeaderProps {
  userCount: number;
}

const RoleManagementHeader: React.FC<RoleManagementHeaderProps> = ({ userCount }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
        <p className="text-gray-600">Manage user roles and permissions</p>
      </div>
      <Badge variant="outline" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        {userCount} Users
      </Badge>
    </div>
  );
};

export default RoleManagementHeader;
