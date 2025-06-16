
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
  isAuthReady: boolean;
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
  const [isAuthReady, setIsAuthReady] = useState(false);

  const createDefaultProfile = async (userId: string, userEmail: string) => {
    try {
      console.log('Creating default profile for user:', userId);
      
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

  const fetchUserPermissions = async (roleId: string): Promise<Permission[]> => {
    try {
      console.log('Fetching permissions for role ID:', roleId);
      
      const { data: rolePermissions, error } = await supabase
        .from('role_permissions')
        .select(`
          permission_id,
          permissions!inner(
            name,
            description,
            module,
            action
          )
        `)
        .eq('role_id', roleId);

      if (error) {
        console.error('Error fetching permissions:', error);
        return [];
      }

      if (rolePermissions) {
        const perms = rolePermissions.map(rp => ({
          name: rp.permissions.name,
          description: rp.permissions.description,
          module: rp.permissions.module,
          action: rp.permissions.action
        }));
        console.log('Fetched permissions:', perms);
        return perms;
      }
      return [];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  };

  const fetchUserData = async (userId: string, userEmail?: string) => {
    try {
      console.log('Fetching user data for:', userId);
      
      let { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError?.code === 'PGRST116') {
        profile = await createDefaultProfile(userId, userEmail || '');
      } else if (profileError) {
        throw profileError;
      }

      if (!profile) {
        console.log('No profile found and unable to create one');
        return { profile: null, role: null, permissions: [] };
      }

      console.log('Profile found:', profile);

      let roleData = null;
      let userPermissions: Permission[] = [];
      
      if (profile.custom_role_id) {
        console.log('Fetching role with ID:', profile.custom_role_id);
        const { data: customRole, error: roleError } = await supabase
          .from('custom_roles')
          .select('*')
          .eq('id', profile.custom_role_id)
          .single();
        
        if (customRole && !roleError) {
          console.log('Found custom role:', customRole);
          roleData = customRole;
          userPermissions = await fetchUserPermissions(customRole.id);
        } else {
          console.log('Role fetch error or no role found:', roleError);
        }
      }

      if (!roleData && profile.role) {
        console.log('Fallback to role string:', profile.role);
        const { data: systemRole, error: systemRoleError } = await supabase
          .from('custom_roles')
          .select('*')
          .eq('name', profile.role)
          .eq('is_system_role', true)
          .single();

        if (systemRole && !systemRoleError) {
          console.log('Found system role:', systemRole);
          roleData = systemRole;
          userPermissions = await fetchUserPermissions(systemRole.id);
          
          await supabase
            .from('user_profiles')
            .update({ custom_role_id: systemRole.id })
            .eq('id', profile.id);
        } else {
          console.log('System role fetch error:', systemRoleError);
        }
      }

      console.log('Final user data:', { profile, role: roleData, permissions: userPermissions });
      return { profile, role: roleData, permissions: userPermissions };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      setLoading(true);
      try {
        const { profile, role, permissions: userPermissions } = await fetchUserData(user.id, user.email);
        setUserProfile(profile);
        setUserRole(role);
        setPermissions(userPermissions);
        setError(null);
      } catch (error) {
        console.error('Error refreshing user:', error);
        setError('Failed to refresh user data');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('Initial session user ID:', initialSession?.user?.id);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user?.id) {
          try {
            const { profile, role, permissions: userPermissions } = await fetchUserData(
              initialSession.user.id, 
              initialSession.user.email
            );
            
            if (mounted) {
              setUserProfile(profile);
              setUserRole(role);
              setPermissions(userPermissions);
              setError(null);
            }
          } catch (error) {
            if (mounted) {
              console.error('Error loading initial user data:', error);
              setError('Failed to load user data');
              setUserProfile(null);
              setUserRole(null);
              setPermissions([]);
            }
          }
        }
        
        if (mounted) {
          setLoading(false);
          setIsAuthReady(true);
        }
      } catch (error) {
        if (mounted) {
          console.error('Error initializing auth:', error);
          setLoading(false);
          setIsAuthReady(true);
          setError('Failed to initialize authentication');
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id && event !== 'TOKEN_REFRESHED') {
          setLoading(true);
          setIsAuthReady(false);
          
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const { profile, role, permissions: userPermissions } = await fetchUserData(
                session.user.id, 
                session.user.email
              );
              
              if (mounted) {
                setUserProfile(profile);
                setUserRole(role);
                setPermissions(userPermissions);
                setError(null);
              }
            } catch (error) {
              if (mounted) {
                console.error('Error loading user data:', error);
                setError('Failed to load user data');
                setUserProfile(null);
                setUserRole(null);
                setPermissions([]);
              }
            } finally {
              if (mounted) {
                setLoading(false);
                setIsAuthReady(true);
              }
            }
          }, 100);
        } else if (!session?.user) {
          setUserProfile(null);
          setUserRole(null);
          setPermissions([]);
          setError(null);
          setLoading(false);
          setIsAuthReady(true);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    setUserRole(null);
    setPermissions([]);
    setError(null);
    setIsAuthReady(true);
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
    isAuthReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
