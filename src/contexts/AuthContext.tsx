
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserRole {
  id: string;
  name: string;
  description: string;
  is_system_role: boolean;
  color: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  custom_role_id: string | null;
  merchant_id: string | null;
  study_hall_id: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface Permission {
  name: string;
  description: string;
  module: string;
  action: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  permissions: Permission[];
  loading: boolean;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roleName: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return null;
      }

      console.log('User profile found:', profile);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const fetchUserRole = async (profile: UserProfile) => {
    try {
      let roleData = null;

      // First try to get role from custom_role_id
      if (profile.custom_role_id) {
        const { data: customRole, error: customRoleError } = await supabase
          .from('custom_roles')
          .select('*')
          .eq('id', profile.custom_role_id)
          .single();

        if (!customRoleError && customRole) {
          roleData = customRole;
        }
      }

      // Fallback to role string if no custom role found
      if (!roleData && profile.role) {
        const { data: systemRole, error: systemRoleError } = await supabase
          .from('custom_roles')
          .select('*')
          .eq('name', profile.role)
          .eq('is_system_role', true)
          .single();

        if (!systemRoleError && systemRole) {
          roleData = systemRole;
        }
      }

      console.log('User role found:', roleData);
      return roleData;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  const fetchUserPermissions = async (roleId: string) => {
    try {
      const { data: rolePermissions, error: permissionsError } = await supabase
        .from('role_permissions')
        .select(`
          permissions (
            name,
            description,
            module,
            action
          )
        `)
        .eq('role_id', roleId);

      if (permissionsError) {
        console.error('Permissions fetch error:', permissionsError);
        return [];
      }

      const permissions = rolePermissions
        .map(rp => rp.permissions)
        .filter(Boolean) as Permission[];

      console.log('User permissions found:', permissions);
      return permissions;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true);
      
      const profile = await fetchUserProfile(userId);
      if (!profile) {
        console.log('No profile found, user needs to complete setup');
        setUserProfile(null);
        setUserRole(null);
        setPermissions([]);
        return;
      }

      setUserProfile(profile);

      const role = await fetchUserRole(profile);
      if (role) {
        setUserRole(role);
        const userPermissions = await fetchUserPermissions(role.id);
        setPermissions(userPermissions);
      } else {
        console.log('No role found for user');
        setUserRole(null);
        setPermissions([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      await loadUserData(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          await loadUserData(session.user.id);
        } else {
          setUserProfile(null);
          setUserRole(null);
          setPermissions([]);
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user?.id) {
        await loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    setUserRole(null);
    setPermissions([]);
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.some(p => p.name === permission);
  };

  const hasRole = (roleName: string): boolean => {
    return userRole?.name === roleName;
  };

  const value = {
    user,
    session,
    userProfile,
    userRole,
    permissions,
    loading,
    signOut,
    hasPermission,
    hasRole,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
