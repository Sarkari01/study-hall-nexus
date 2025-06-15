
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
import { Search, UserPlus, Shield, Calendar, Users } from "lucide-react";

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

interface UserProfile {
  user_id: string;
  full_name: string;
  avatar_url: string;
}

const UserRoleAssignment = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    getCurrentUser();
    fetchUserRoles();
    fetchRoles();
    fetchUserProfiles();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchUserRoles = async () => {
    try {
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          *,
          custom_roles!inner (name, color, description)
        `)
        .order('assigned_at', { ascending: false });

      if (userRolesError) throw userRolesError;
      return userRolesData || [];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  };

  const fetchUserProfiles = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, avatar_url');

      if (profilesError) throw profilesError;
      setUserProfiles(profilesData || []);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
  };

  const mergeUserRolesWithProfiles = async () => {
    try {
      const userRolesData = await fetchUserRoles();
      
      const mergedData = userRolesData.map(userRole => {
        const profile = userProfiles.find(p => p.user_id === userRole.user_id);
        return {
          ...userRole,
          user_profiles: profile ? {
            full_name: profile.full_name || 'Unknown User',
            avatar_url: profile.avatar_url || ''
          } : null
        };
      });

      setUserRoles(mergedData as UserRole[]);
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

  useEffect(() => {
    if (userProfiles.length > 0) {
      mergeUserRolesWithProfiles();
    }
  }, [userProfiles]);

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
    if (!selectedUserId || !selectedRoleId) {
      toast({
        title: "Error",
        description: "Please select both user ID and role",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUserId,
          role_id: selectedRoleId,
          expires_at: expiryDate || null,
          assigned_by: currentUser?.id
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
      
      // Refresh data
      await fetchUserProfiles();
      await mergeUserRolesWithProfiles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
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

      await mergeUserRolesWithProfiles();
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
    userRole.custom_roles.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userRole.user_id.toLowerCase().includes(searchTerm.toLowerCase())
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
                  placeholder="Enter user ID (get from auth.users table)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: You can find user IDs in the Supabase auth.users table
                </p>
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

      {/* Quick assign current user as super admin */}
      {currentUser && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Quick Setup</p>
                  <p className="text-sm text-blue-700">
                    Assign yourself as Super Admin to access all features
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedUserId(currentUser.id);
                  const superAdminRole = roles.find(r => r.name === 'super_admin');
                  if (superAdminRole) {
                    setSelectedRoleId(superAdminRole.id);
                    setIsAssignModalOpen(true);
                  }
                }}
              >
                Make Me Super Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold">{userRoles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Roles</p>
                <p className="text-2xl font-bold">{userRoles.filter(ur => ur.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">With Expiry</p>
                <p className="text-2xl font-bold">{userRoles.filter(ur => ur.expires_at).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by user name, role, or user ID..."
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
                {filteredUserRoles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No role assignments found. Click "Assign Role" to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleAssignment;
