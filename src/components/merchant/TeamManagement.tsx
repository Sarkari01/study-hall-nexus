
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Search, Mail, Phone, Shield, Edit, Trash2, MoreHorizontal, Users, Crown, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface InchargeUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'manager' | 'supervisor' | 'staff';
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  joinedDate: string;
  lastActive: string;
  studyHallsAssigned: string[];
  avatar?: string;
}

const TeamManagement = () => {
  const [inchargeUsers, setInchargeUsers] = useState<InchargeUser[]>([
    {
      id: '1',
      name: 'Amit Kumar',
      email: 'amit.kumar@studyspace.com',
      phone: '+91 98765 43210',
      role: 'manager',
      status: 'active',
      permissions: ['manage_bookings', 'view_analytics', 'manage_staff'],
      joinedDate: '2024-01-15',
      lastActive: '2024-01-20T14:30:00Z',
      studyHallsAssigned: ['Premium Study Room A', 'Deluxe Study Hall B'],
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@studyspace.com',
      phone: '+91 87654 32109',
      role: 'supervisor',
      status: 'active',
      permissions: ['manage_bookings', 'view_analytics'],
      joinedDate: '2024-01-20',
      lastActive: '2024-01-20T16:45:00Z',
      studyHallsAssigned: ['Premium Study Room A'],
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '3',
      name: 'Rahul Patel',
      email: 'rahul.patel@studyspace.com',
      phone: '+91 76543 21098',
      role: 'staff',
      status: 'pending',
      permissions: ['view_bookings'],
      joinedDate: '2024-01-18',
      lastActive: 'Never',
      studyHallsAssigned: ['Deluxe Study Hall B']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    studyHallsAssigned: []
  });

  const { toast } = useToast();

  const roleColors = {
    manager: 'bg-purple-100 text-purple-800',
    supervisor: 'bg-blue-100 text-blue-800',
    staff: 'bg-green-100 text-green-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  const handleAddInchargeUser = () => {
    const user: InchargeUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role as 'manager' | 'supervisor' | 'staff',
      status: 'pending',
      permissions: getDefaultPermissions(newUser.role),
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Never',
      studyHallsAssigned: []
    };

    setInchargeUsers(prev => [...prev, user]);
    setNewUser({ name: '', email: '', phone: '', role: 'staff', studyHallsAssigned: [] });
    setIsAddModalOpen(false);
    
    toast({
      title: "Success",
      description: "Incharge user invitation sent successfully",
    });
  };

  const getDefaultPermissions = (role: string) => {
    switch (role) {
      case 'manager':
        return ['manage_bookings', 'view_analytics', 'manage_staff', 'study_hall_access'];
      case 'supervisor':
        return ['manage_bookings', 'view_analytics', 'study_hall_access'];
      case 'staff':
        return ['view_bookings', 'study_hall_access'];
      default:
        return ['study_hall_access'];
    }
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive') => {
    setInchargeUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    
    toast({
      title: "Status Updated",
      description: `Incharge user status changed to ${newStatus}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setInchargeUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "User Removed",
      description: "Incharge user has been removed successfully",
    });
  };

  const filteredUsers = inchargeUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'manager': return <Crown className="h-4 w-4" />;
      case 'supervisor': return <Shield className="h-4 w-4" />;
      case 'staff': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Incharge User Management</h2>
          <p className="text-gray-600">Manage your study hall incharge users and their permissions</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Incharge User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Incharge User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Incharge Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff Incharge</SelectItem>
                    <SelectItem value="supervisor">Supervisor Incharge</SelectItem>
                    <SelectItem value="manager">Manager Incharge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Incharge users will have access to manage study hall operations, bookings, and assigned duties only.
                </p>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button onClick={handleAddInchargeUser} disabled={!newUser.name || !newUser.email}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Incharge Users</p>
                <p className="text-2xl font-bold">{inchargeUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Managers</p>
                <p className="text-2xl font-bold">{inchargeUsers.filter(u => u.role === 'manager').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Supervisors</p>
                <p className="text-2xl font-bold">{inchargeUsers.filter(u => u.role === 'supervisor').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{inchargeUsers.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search incharge users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incharge Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Incharge Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incharge User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Halls</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${roleColors[user.role]} flex items-center space-x-1 w-fit`}>
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[user.status]}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {user.studyHallsAssigned.length > 0 ? (
                        user.studyHallsAssigned.slice(0, 2).map(hall => (
                          <Badge key={hall} variant="outline" className="text-xs mr-1">
                            {hall}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">None assigned</span>
                      )}
                      {user.studyHallsAssigned.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.studyHallsAssigned.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.lastActive === 'Never' ? (
                        <span className="text-gray-400">Never</span>
                      ) : (
                        <span>{new Date(user.lastActive).toLocaleDateString()}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        {user.status === 'active' ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'inactive')}>
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
