
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ValidRole, ROLE_HIERARCHY, VALID_ROLES } from "@/utils/roleValidation";
import { usePermissions } from "@/hooks/usePermissions";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: string | null;
}

interface AuthUser {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: ValidRole | null;
  created_at: string;
  last_sign_in_at: string;
}

export const useRoleManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRole[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<ValidRole | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userRole } = usePermissions();

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          full_name,
          role
        `) as { data: UserProfile[] | null; error: any };

      if (error) throw error;

      const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      const authUsers = authResponse?.users || [];

      const combinedUsers: UserWithRole[] = (profiles || []).map(profile => {
        const authUser = authUsers.find((u: AuthUser) => u.id === profile.user_id);
        return {
          id: profile.user_id || '',
          email: authUser?.email || 'Unknown',
          full_name: profile.full_name || 'Unknown User',
          role: profile.role as ValidRole || null,
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

  const assignRole = async (userId: string, newRole: ValidRole) => {
    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ));

      toast({
        title: "Success",
        description: `Role updated successfully`,
      });

      return true;
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive"
      });
      return false;
    }
  };

  const getAssignableRoles = (): ValidRole[] => {
    if (!userRole?.name) return [];
    const userLevel = ROLE_HIERARCHY[userRole.name as ValidRole] || 0;
    return VALID_ROLES.filter(role => ROLE_HIERARCHY[role] < userLevel);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  return {
    users: filteredUsers,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    loading,
    assignRole,
    getAssignableRoles,
    refreshUsers: fetchUsers
  };
};
