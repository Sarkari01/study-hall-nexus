
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Clock, Settings, Mail, Phone, MapPin, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getRoleDisplayName } from "@/utils/roleValidation";
import { format } from "date-fns";

const AdminDetails = () => {
  const { user, userProfile, userRole, permissions } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const module = permission.module;
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Details</h2>
          <p className="text-gray-600">Manage your admin profile and view system access</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={userProfile?.avatar_url || undefined} />
                <AvatarFallback className="text-lg">
                  {userProfile?.full_name ? getInitials(userProfile.full_name) : 'AD'}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">
                {userProfile?.full_name || 'Admin User'}
              </h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
              {userRole && (
                <Badge className="mt-2 bg-red-100 text-red-800">
                  {getRoleDisplayName(userRole.name as any)}
                </Badge>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{user?.email}</span>
              </div>
              {userProfile?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{userProfile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>
                  Joined {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Access & Permissions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Access & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Role Information */}
              <div>
                <h4 className="font-medium mb-2">Current Role</h4>
                <div className="flex items-center gap-2">
                  {userRole ? (
                    <>
                      <Badge 
                        className="bg-red-100 text-red-800"
                        style={{ backgroundColor: userRole.color + '20', color: userRole.color }}
                      >
                        {getRoleDisplayName(userRole.name as any)}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {userRole.description}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">No role assigned</span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Permissions by Module */}
              <div>
                <h4 className="font-medium mb-3">Permissions by Module</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                    <div key={module} className="p-3 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-sm text-gray-900 mb-2 capitalize">
                        {module} Module
                      </h5>
                      <div className="space-y-1">
                        {modulePermissions.map((permission) => (
                          <div key={permission.name} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">
                              {permission.action.charAt(0).toUpperCase() + permission.action.slice(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {permissions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No specific permissions assigned</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-1">User ID</h4>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {user?.id || 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-1">Last Sign In</h4>
              <p className="text-sm">
                {user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-1">Account Status</h4>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDetails;
