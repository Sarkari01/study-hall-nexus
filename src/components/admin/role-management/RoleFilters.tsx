
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { ValidRole, getRoleDisplayName, VALID_ROLES } from "@/utils/roleValidation";

interface RoleFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedRole: ValidRole | 'all';
  onRoleChange: (role: ValidRole | 'all') => void;
}

const RoleFilters: React.FC<RoleFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={selectedRole} onValueChange={(value) => onRoleChange(value as ValidRole | 'all')}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {VALID_ROLES.map(role => (
                <SelectItem key={role} value={role}>
                  {getRoleDisplayName(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleFilters;
