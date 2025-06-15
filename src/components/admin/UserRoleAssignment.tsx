
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, UserPlus, Shield, Calendar } from "lucide-react";

interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  expires_at: string | null;
  is_active: boolean;
  custom_roles: {
    name: string;
    color: string;
    description: string;
  };
  user_profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
}

const UserRoleAssignment = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
    fetchRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          custom_roles (name, color, description),
          user_profiles (full_name, avatar_url)
        `)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user roles",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_roles')
        .select('id, name, description, color')
        .order('name', { ascending: true });

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRoleId) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUserId,
          role_id: selectedRoleId,
          expires_at: expiryDate || null,
          assigned_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role assigned successfully",
      });

      setIsAssignModalOpen(false);
      setSelectedUserId('');
      setSelectedRoleId('');
      setExpiryDate('');
      fetchUserRoles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
    }
  };

  const handleToggleRoleStatus = async (userRoleId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: !currentStatus })
        .eq('id', userRoleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Role ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });

      fetchUserRoles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role status",
        variant: "destructive",
      });
    }
  };

  const filteredUserRoles = userRoles.filter(userRole => 
    userRole.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userRole.custom_roles.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Role Assignment</h2>
          <p className="text-gray-600">Assign and manage user roles</p>
        </div>
        <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Role to User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">User ID</label>
                <Input
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  placeholder="Enter user ID"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: role.color }}
                          />
                          {role.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Expiry Date (Optional)</label>
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAssignRole}>
                  Assign Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by user name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Role Assignments ({filteredUserRoles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUserRoles.map((userRole) => (
                  <TableRow key={userRole.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {userRole.user_profiles?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">
                            {userRole.user_profiles?.full_name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-500">{userRole.user_id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: userRole.custom_roles.color }}
                        />
                        <span className="font-medium">{userRole.custom_roles.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(userRole.assigned_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {userRole.expires_at ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(userRole.expires_at).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-500">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={userRole.is_active ? "default" : "secondary"}>
                        {userRole.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={userRole.is_active ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleRoleStatus(userRole.id, userRole.is_active)}
                      >
                        {userRole.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleAssignment;
