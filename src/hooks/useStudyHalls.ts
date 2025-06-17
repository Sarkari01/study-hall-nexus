
import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface StudyHall {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  price_per_day: number;
  price_per_week: number | null;
  price_per_month: number | null;
  amenities: string[];
  operating_hours: any;
  status: 'active' | 'inactive' | 'maintenance';
  rating: number;
  total_revenue: number;
  total_bookings: number;
  is_featured: boolean;
  merchant_id: string;
  created_at: string;
  updated_at: string;
  merchant?: {
    business_name: string;
    full_name: string;
    contact_number: string;
  };
}

export const useStudyHalls = () => {
  const [studyHalls, setStudyHalls] = useState<StudyHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, userRole, isAuthReady } = useAuth();
  const isMountedRef = useRef(true);

  const fetchStudyHalls = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useStudyHalls: Starting fetch, user:', user?.id, 'role:', userRole?.name);
      
      if (!user || !isAuthReady) {
        console.log('useStudyHalls: User not authenticated or auth not ready');
        if (isMountedRef.current) {
          setStudyHalls([]);
          setError('Authentication required');
          setLoading(false);
        }
        return;
      }

      let query = supabase
        .from('study_halls')
        .select(`
          *,
          merchant_profiles!study_halls_merchant_id_fkey (
            business_name,
            full_name,
            contact_number
          )
        `)
        .order('created_at', { ascending: false });

      // If merchant, only show their own study halls
      if (userRole?.name === 'merchant') {
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('merchant_id')
          .eq('user_id', user.id)
          .single();

        if (userProfile?.merchant_id) {
          query = query.eq('merchant_id', userProfile.merchant_id);
        } else {
          console.log('useStudyHalls: Merchant user has no merchant_id');
          if (isMountedRef.current) {
            setStudyHalls([]);
            setError('Merchant profile not found');
            setLoading(false);
          }
          return;
        }
      } else if (userRole?.name === 'student') {
        // Students see only active study halls
        query = query.eq('status', 'active');
      } else if (userRole?.name !== 'admin') {
        console.log('useStudyHalls: User does not have permission to view study halls');
        if (isMountedRef.current) {
          setStudyHalls([]);
          setError('Permission denied');
          setLoading(false);
        }
        return;
      }

      const { data: studyHallsData, error: studyHallsError } = await query;

      console.log('useStudyHalls: Study halls response:', { data: studyHallsData, error: studyHallsError });

      if (studyHallsError) {
        console.error('useStudyHalls: Error fetching study halls:', studyHallsError);
        throw studyHallsError;
      }

      const typedStudyHalls = (studyHallsData || []).map(hall => ({
        ...hall,
        status: hall.status as 'active' | 'inactive' | 'maintenance',
        merchant: hall.merchant_profiles ? {
          business_name: hall.merchant_profiles.business_name,
          full_name: hall.merchant_profiles.full_name,
          contact_number: hall.merchant_profiles.contact_number
        } : undefined
      }));

      console.log('useStudyHalls: Final processed study halls:', typedStudyHalls);

      if (isMountedRef.current) {
        setStudyHalls(typedStudyHalls);
        setError(null);
        
        toast({
          title: "Success",
          description: `Loaded ${typedStudyHalls.length} study halls`,
        });
      }
    } catch (err) {
      console.error('useStudyHalls: Error in fetchStudyHalls:', err);
      if (isMountedRef.current) {
        setError('Failed to fetch study halls');
        setStudyHalls([]);
        toast({
          title: "Error",
          description: "Failed to fetch study halls. Please check your permissions.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const updateStudyHall = async (hallId: string, updates: Partial<StudyHall>) => {
    try {
      console.log('useStudyHalls: Updating study hall:', hallId, updates);
      
      const { error } = await supabase
        .from('study_halls')
        .update(updates)
        .eq('id', hallId);

      if (error) throw error;

      if (isMountedRef.current) {
        setStudyHalls(prev => prev.map(hall => 
          hall.id === hallId 
            ? { ...hall, ...updates }
            : hall
        ));

        toast({
          title: "Success",
          description: "Study hall updated successfully",
        });
      }
    } catch (err) {
      console.error('useStudyHalls: Error updating study hall:', err);
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to update study hall",
          variant: "destructive",
        });
      }
    }
  };

  const createStudyHall = async (hallData: Omit<StudyHall, 'id' | 'created_at' | 'updated_at' | 'merchant'>) => {
    try {
      console.log('useStudyHalls: Creating study hall:', hallData);
      
      const { data, error } = await supabase
        .from('study_halls')
        .insert([hallData])
        .select()
        .single();

      if (error) throw error;

      if (isMountedRef.current) {
        setStudyHalls(prev => [data, ...prev]);
        
        toast({
          title: "Success",
          description: "Study hall created successfully",
        });
      }

      return data;
    } catch (err) {
      console.error('useStudyHalls: Error creating study hall:', err);
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to create study hall",
          variant: "destructive",
        });
      }
      throw err;
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    if (isAuthReady) {
      fetchStudyHalls();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user, userRole, isAuthReady]);

  return {
    studyHalls,
    loading,
    error,
    fetchStudyHalls,
    updateStudyHall,
    createStudyHall
  };
};
