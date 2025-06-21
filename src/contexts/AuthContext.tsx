
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
      
      const defaultProfile = {
        user_id: userId,
        full_name: userEmail.split('@')[0],
        role: 'student'
      };

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert(defaultProfile)
        .select()
        .single();

      if (profileError) {
        console.error('Error creating default profile:', profileError);
        return null;
      }
      
      console.log('Default profile created:', profile);
      return profile;
    } catch (error) {
      console.error('Error in createDefaultProfile:', error);
      return null;
    }
  };

  const fetchUserData = async (userId: string, userEmail?: string) => {
    try {
      console.log('AuthContext: Fetching user data for:', userId);
      
      // Try to get the user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('AuthContext: Error fetching profile:', profileError);
        throw profileError;
      }

      let finalProfile = profile;

      // If no profile exists, create a default one
      if (!profile && userEmail) {
        console.log('AuthContext: No profile found, creating default profile');
        finalProfile = await createDefaultProfile(userId, userEmail);
      }

      if (!finalProfile) {
        console.log('AuthContext: No profile found and unable to create one');
        return { profile: null, role: null, permissions: [] };
      }

      console.log('AuthContext: Profile found/created:', finalProfile);

      // Create role data based on the profile role
      const roleData = {
        id: finalProfile.custom_role_id || '',
        name: finalProfile.role || 'student',
        description: `${finalProfile.role || 'student'} role`,
        is_system_role: true,
        color: finalProfile.role === 'admin' ? '#059669' : '#3B82F6'
      };

      console.log('AuthContext: Final user data:', { profile: finalProfile, role: roleData });
      return { profile: finalProfile, role: roleData, permissions: [] };
    } catch (error) {
      console.error('AuthContext: Error fetching user data:', error);
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
        console.error('AuthContext: Error refreshing user:', error);
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
        console.log('AuthContext: Initializing auth...');
        
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('AuthContext: Initial session:', !!initialSession?.user);
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
              console.error('AuthContext: Error loading initial user data:', error);
              setError('Failed to load user data');
            }
          }
        }
        
        if (mounted) {
          setLoading(false);
          setIsAuthReady(true);
        }
      } catch (error) {
        if (mounted) {
          console.error('AuthContext: Error initializing auth:', error);
          setLoading(false);
          setIsAuthReady(true);
          setError('Failed to initialize authentication');
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('AuthContext: Auth state changed:', event, !!session?.user);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id && event !== 'TOKEN_REFRESHED') {
          setLoading(true);
          
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
              setIsAuthReady(true);
            }
          } catch (error) {
            if (mounted) {
              console.error('AuthContext: Error loading user data:', error);
              setError('Failed to load user data');
              setIsAuthReady(true);
            }
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
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
    // Admin has all permissions
    if (userRole?.name === 'admin') return true;
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
