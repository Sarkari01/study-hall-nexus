
import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StudyHall {
  id: string;
  name: string;
  merchant_id?: string;
  description?: string;
  location: string;
  capacity: number;
  price_per_day: number;
  price_per_week?: number;
  price_per_month?: number;
  amenities: string[];
  status: 'draft' | 'active' | 'inactive' | 'maintenance';
  rating: number;
  total_bookings: number;
  total_revenue: number;
  is_featured: boolean;
  operating_hours?: any;
  created_at: string;
  updated_at: string;
}

export const useStudyHalls = () => {
  const [studyHalls, setStudyHalls] = useState<StudyHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMountedRef = useRef(true);

  const fetchStudyHalls = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_halls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion to ensure status field matches our interface
      const typedStudyHalls = (data || []).map(hall => ({
        ...hall,
        status: hall.status as 'draft' | 'active' | 'inactive' | 'maintenance'
      }));

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setStudyHalls(typedStudyHalls);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching study halls:', err);
      if (isMountedRef.current) {
        setError('Failed to fetch study halls');
        toast({
          title: "Error",
          description: "Failed to fetch study halls",
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const deleteStudyHall = async (studyHallId: string) => {
    try {
      const { error } = await supabase
        .from('study_halls')
        .delete()
        .eq('id', studyHallId);

      if (error) throw error;

      if (isMountedRef.current) {
        setStudyHalls(prev => prev.filter(hall => hall.id !== studyHallId));
        toast({
          title: "Success",
          description: "Study hall deleted successfully",
        });
      }
    } catch (err) {
      console.error('Error deleting study hall:', err);
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to delete study hall",
          variant: "destructive",
        });
      }
    }
  };

  const updateStudyHall = async (studyHallId: string, updates: Partial<StudyHall>) => {
    try {
      const { error } = await supabase
        .from('study_halls')
        .update(updates)
        .eq('id', studyHallId);

      if (error) throw error;

      if (isMountedRef.current) {
        setStudyHalls(prev => prev.map(hall => 
          hall.id === studyHallId 
            ? { ...hall, ...updates }
            : hall
        ));

        toast({
          title: "Success",
          description: "Study hall updated successfully",
        });
      }
    } catch (err) {
      console.error('Error updating study hall:', err);
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to update study hall",
          variant: "destructive",
        });
      }
    }
  };

  const addStudyHall = (studyHall: StudyHall) => {
    if (isMountedRef.current) {
      setStudyHalls(prev => [studyHall, ...prev]);
    }
  };

  const createStudyHall = async (hallData: Omit<StudyHall, 'id' | 'created_at' | 'updated_at' | 'rating' | 'total_bookings' | 'total_revenue'>) => {
    try {
      const { data, error } = await supabase
        .from('study_halls')
        .insert([hallData])
        .select()
        .single();

      if (error) throw error;

      const typedStudyHall: StudyHall = {
        ...data,
        status: data.status as 'draft' | 'active' | 'inactive' | 'maintenance'
      };

      if (isMountedRef.current) {
        addStudyHall(typedStudyHall);
        toast({
          title: "Success",
          description: "Study hall created successfully",
        });
      }

      return typedStudyHall;
    } catch (err) {
      console.error('Error creating study hall:', err);
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
    fetchStudyHalls();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    studyHalls,
    loading,
    error,
    fetchStudyHalls,
    deleteStudyHall,
    updateStudyHall,
    addStudyHall,
    createStudyHall
  };
};
