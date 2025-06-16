
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
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  const createDefaultProfile = async (userId: string, userEmail: string) => {
    try {
      console.log('Creating default profile for user:', userId);
      
      // Get the student role
      const { data: studentRole } = await supabase
        .from('custom_roles')
        .select('id')
        .eq('name', 'student')
        .eq('is_system_role', true)
        .single();

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          full_name: userEmail.split('@')[0],
          role: 'student',
          custom_role_id: studentRole?.id || null
        })
        .select()
        .single();

      if (profileError) throw profileError;
      
      console.log('Default profile created:', profile);
      return profile;
    } catch (error) {
      console.error('Error creating default profile:', error);
      return null;
    }
  };

  const fetchUserProfile = async (userId: string, userEmail?: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      let { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError?.code === 'PGRST116') {
        // No profile found, create default one
        console.log('No profile found, creating default profile');
        profile = await createDefaultProfile(userId, userEmail || '');
      } else if (profileError) {
        throw profileError;
      }

      console.log('User profile found:', profile);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch user profile');
      return null;
    }
  };

  const fetchUserRole = async (profile: UserProfile) => {
    try {
      console.log('Fetching role for profile:', profile);
      let roleData = null;

      // First try to get role from custom_role_id
      if (profile.custom_role_id) {
        console.log('Looking up role by custom_role_id:', profile.custom_role_id);
        const { data: customRole, error: customRoleError } = await supabase
          .from('custom_roles')
          .select('*')
          .eq('id', profile.custom_role_id)
          .single();

        if (!customRoleError && customRole) {
          console.log('Found role by custom_role_id:', customRole);
          roleData = customRole;
        } else {
          console.error('Error fetching custom role:', customRoleError);
        }
      }

      // Fallback to role string if no custom role found
      if (!roleData && profile.role) {
        console.log('Fallback: Looking up role by name:', profile.role);
        const { data: systemRole, error: systemRoleError } = await supabase
          .from('custom_roles')
          .select('*')
          .eq('name', profile.role)
          .eq('is_system_role', true)
          .single();

        if (!systemRoleError && systemRole) {
          console.log('Found role by name:', systemRole);
          roleData = systemRole;
          
          // Update profile with the role ID
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ custom_role_id: systemRole.id })
            .eq('id', profile.id);
            
          if (updateError) {
            console.error('Error updating profile with role ID:', updateError);
          }
        } else {
          console.error('Error fetching system role:', systemRoleError);
        }
      }

      console.log('Final role data:', roleData);
      return roleData;
    } catch (error) {
      console.error('Error fetching user role:', error);
      setError('Failed to fetch user role');
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
      setError('Failed to fetch user permissions');
      return [];
    }
  };

  const loadUserData = async (userId: string, userEmail?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const profile = await fetchUserProfile(userId, userEmail);
      if (!profile) {
        console.log('No profile found and unable to create one');
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
        console.log('No role found for user, defaulting to student');
        setUserRole(null);
        setPermissions([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      await loadUserData(user.id, user.email);
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
          await loadUserData(session.user.id, session.user.email);
        } else {
          setUserProfile(null);
          setUserRole(null);
          setPermissions([]);
          setError(null);
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
        await loadUserData(session.user.id, session.user.email);
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
    setError(null);
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
    error,
    signOut,
    hasPermission,
    hasRole,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
