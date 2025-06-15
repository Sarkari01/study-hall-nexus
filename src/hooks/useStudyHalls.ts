
import { useState, useEffect } from 'react';
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

      setStudyHalls(typedStudyHalls);
      setError(null);
    } catch (err) {
      console.error('Error fetching study halls:', err);
      setError('Failed to fetch study halls');
      toast({
        title: "Error",
        description: "Failed to fetch study halls",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteStudyHall = async (studyHallId: string) => {
    try {
      const { error } = await supabase
        .from('study_halls')
        .delete()
        .eq('id', studyHallId);

      if (error) throw error;

      setStudyHalls(prev => prev.filter(hall => hall.id !== studyHallId));
      toast({
        title: "Success",
        description: "Study hall deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting study hall:', err);
      toast({
        title: "Error",
        description: "Failed to delete study hall",
        variant: "destructive",
      });
    }
  };

  const updateStudyHall = async (studyHallId: string, updates: Partial<StudyHall>) => {
    try {
      const { error } = await supabase
        .from('study_halls')
        .update(updates)
        .eq('id', studyHallId);

      if (error) throw error;

      setStudyHalls(prev => prev.map(hall => 
        hall.id === studyHallId 
          ? { ...hall, ...updates }
          : hall
      ));

      toast({
        title: "Success",
        description: "Study hall updated successfully",
      });
    } catch (err) {
      console.error('Error updating study hall:', err);
      toast({
        title: "Error",
        description: "Failed to update study hall",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStudyHalls();
  }, []);

  return {
    studyHalls,
    loading,
    error,
    fetchStudyHalls,
    deleteStudyHall,
    updateStudyHall,
    addStudyHall: (studyHall: StudyHall) => setStudyHalls(prev => [studyHall, ...prev])
  };
};
