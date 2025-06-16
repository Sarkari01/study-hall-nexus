
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, Users, Shield, Edit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VALID_ROLES, ValidRole, getRoleDisplayName, canManageRole, ROLE_HIERARCHY } from "@/utils/roleValidation";
import { usePermissions } from "@/hooks/usePermissions";

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: ValidRole | null;
  created_at: string;
  last_sign_in_at: string;
}

const RoleManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRole[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<ValidRole | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<ValidRole | ''>('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const { toast } = useToast();
  const { userRole, roleManagement } = usePermissions();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  const fetchUsers = async () => {
    try {
      // Get user profiles with their roles
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          full_name,
          role,
          custom_roles!inner(name)
        `);

      if (error) throw error;

      // Get auth users for email and timestamps
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Combine the data
      const combinedUsers: UserWithRole[] = profiles.map(profile => {
        const authUser = authUsers.users.find(u => u.id === profile.user_id);
        return {
          id: profile.user_id,
          email: authUser?.email || 'Unknown',
          full_name: profile.full_name || 'Unknown User',
          role: profile.custom_roles?.name as ValidRole || null,
          created_at: authUser?.created_at || '',
          last_sign_in_at: authUser?.last_sign_in_at || ''
        };
      });

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !newRole) return;

    // Check if current user can manage the target role
    if (!roleManagement.canManageRole(newRole)) {
      toast({
        title: "Access Denied",
        description: `You don't have permission to assign the ${getRoleDisplayName(newRole)} role`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the role ID with proper typing
      const { data: roleData, error: roleError } = await supabase
        .from('custom_roles')
        .select('id')
        .eq('name', newRole)
        .single();

      if (roleError) throw roleError;
      if (!roleData) throw new Error('Role not found');

      // Update user profile with new role
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          role: newRole,
          custom_role_id: roleData.id 
        })
        .eq('user_id', selectedUser.id);

      if (updateError) throw updateError;

      // Update local state
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: newRole }
          : user
      ));

      toast({
        title: "Success",
        description: `Role updated to ${getRoleDisplayName(newRole)}`,
      });

      setIsAssignDialogOpen(false);
      setSelectedUser(null);
      setNewRole('');
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive"
      });
    }
  };

  const getAssignableRoles = (): ValidRole[] => {
    if (!userRole?.name) return [];
    const userLevel = ROLE_HIERARCHY[userRole.name as ValidRole] || 0;
    return VALID_ROLES.filter(role => ROLE_HIERARCHY[role] < userLevel);
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {filteredUsers.length} Users
        </Badge>
      </div>

      {/* Filters */}
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as ValidRole | 'all')}>
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users & Roles</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredUsers.map(user => (
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
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.role || '');
                        setIsAssignDialogOpen(true);
                      }}
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
        </CardContent>
      </Card>

      {/* Role Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
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
              <Select value={newRole} onValueChange={(value) => setNewRole(value as ValidRole)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  {getAssignableRoles().map(role => (
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
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={!newRole}>
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;
