
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ValidRole, ROLE_HIERARCHY, VALID_ROLES } from "@/utils/roleValidation";
import { usePermissions } from "@/hooks/usePermissions";
import { InputValidator, USER_VALIDATION_SCHEMA } from "@/utils/inputValidation";
import { apiRateLimiter } from "@/utils/rateLimiter";

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
      // Rate limiting for API calls
      if (!apiRateLimiter.isAllowed('fetch_users')) {
        toast({
          title: "Rate Limit",
          description: "Too many requests. Please wait a moment.",
          variant: "destructive"
        });
        return;
      }

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
        
        // Validate email if present
        const email = authUser?.email || '';
        if (email && !InputValidator.validateEmail(email)) {
          console.warn(`Invalid email format for user ${profile.user_id}`);
        }

        return {
          id: profile.user_id || '',
          email: email || 'Unknown',
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
      // Sanitize search term
      const sanitizedSearch = searchTerm.toLowerCase().trim();
      
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(sanitizedSearch) ||
        user.full_name.toLowerCase().includes(sanitizedSearch)
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const assignRole = async (userId: string, newRole: ValidRole) => {
    try {
      // Rate limiting for role assignment
      if (!apiRateLimiter.isAllowed(`assign_role_${userId}`)) {
        toast({
          title: "Rate Limit",
          description: "Too many role assignment attempts. Please wait.",
          variant: "destructive"
        });
        return false;
      }

      // Validate inputs
      if (!InputValidator.validateUUID(userId)) {
        toast({
          title: "Invalid Input",
          description: "Invalid user ID format",
          variant: "destructive"
        });
        return false;
      }

      if (!VALID_ROLES.includes(newRole)) {
        toast({
          title: "Invalid Role",
          description: "Invalid role specified",
          variant: "destructive"
        });
        return false;
      }

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
