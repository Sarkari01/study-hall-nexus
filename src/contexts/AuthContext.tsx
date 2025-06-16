
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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const createDefaultProfile = async (userId: string, userEmail: string) => {
    try {
      console.log('Creating default profile for user:', userId);
      
      // Get the student role (default role for new users)
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

  const fetchUserData = async (userId: string, userEmail?: string) => {
    try {
      console.log('Fetching user data for:', userId);
      
      // Fetch user profile
      let { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError?.code === 'PGRST116') {
        // No profile found, create default one
        profile = await createDefaultProfile(userId, userEmail || '');
      } else if (profileError) {
        throw profileError;
      }

      if (!profile) {
        console.log('No profile found and unable to create one');
        return { profile: null, role: null };
      }

      // Fetch user role
      let roleData = null;
      if (profile.custom_role_id) {
        const { data: customRole } = await supabase
          .from('custom_roles')
          .select('*')
          .eq('id', profile.custom_role_id)
          .single();
        
        if (customRole) {
          roleData = customRole;
        }
      }

      // Fallback to role string if no custom role found
      if (!roleData && profile.role) {
        const { data: systemRole } = await supabase
          .from('custom_roles')
          .select('*')
          .eq('name', profile.role)
          .eq('is_system_role', true)
          .single();

        if (systemRole) {
          roleData = systemRole;
          
          // Update profile with the role ID
          await supabase
            .from('user_profiles')
            .update({ custom_role_id: systemRole.id })
            .eq('id', profile.id);
        }
      }

      console.log('User data loaded:', { profile, role: roleData });
      return { profile, role: roleData };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      setLoading(true);
      try {
        const { profile, role } = await fetchUserData(user.id, user.email);
        setUserProfile(profile);
        setUserRole(role);
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          setLoading(true);
          setIsAuthReady(false);
          
          // Use setTimeout to prevent blocking the auth state change
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const { profile, role } = await fetchUserData(session.user.id, session.user.email);
              if (mounted) {
                setUserProfile(profile);
                setUserRole(role);
                setError(null);
              }
            } catch (error) {
              if (mounted) {
                console.error('Error loading user data:', error);
                setError('Failed to load user data');
                setUserProfile(null);
                setUserRole(null);
              }
            } finally {
              if (mounted) {
                setLoading(false);
                setIsAuthReady(true);
              }
            }
          }, 0);
        } else {
          setUserProfile(null);
          setUserRole(null);
          setError(null);
          setLoading(false);
          setIsAuthReady(true);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user?.id) {
        setLoading(true);
        try {
          const { profile, role } = await fetchUserData(session.user.id, session.user.email);
          if (mounted) {
            setUserProfile(profile);
            setUserRole(role);
            setError(null);
          }
        } catch (error) {
          if (mounted) {
            console.error('Error loading initial user data:', error);
            setError('Failed to load user data');
            setUserProfile(null);
            setUserRole(null);
          }
        }
      }
      
      if (mounted) {
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    setUserRole(null);
    setError(null);
    setIsAuthReady(true);
  };

  const hasPermission = (permission: string): boolean => {
    // Simplified permission check - in a real app you'd check against user permissions
    return userRole?.name === 'admin' || false;
  };

  const hasRole = (roleName: string): boolean => {
    return userRole?.name === roleName;
  };

  const value = {
    user,
    session,
    userProfile,
    userRole,
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
