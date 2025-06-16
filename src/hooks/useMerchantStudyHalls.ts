
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMerchantProfile } from './useMerchantProfile';

interface StudyHall {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price_per_day: number;
  price_per_week?: number;
  price_per_month?: number;
  amenities: string[];
  status: string;
  rating: number;
  total_bookings: number;
  description?: string;
  merchant_id: string;
  created_at: string;
  updated_at: string;
}

export const useMerchantStudyHalls = () => {
  const { merchantProfile } = useMerchantProfile();
  const [studyHalls, setStudyHalls] = useState<StudyHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStudyHalls = async () => {
    if (!merchantProfile?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('study_halls')
        .select('*')
        .eq('merchant_id', merchantProfile.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching study halls:', fetchError);
        setError('Failed to load study halls');
        return;
      }

      setStudyHalls(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createStudyHall = async (studyHallData: Omit<StudyHall, 'id' | 'merchant_id' | 'created_at' | 'updated_at' | 'rating' | 'total_bookings'>) => {
    if (!merchantProfile?.id) {
      throw new Error('No merchant profile found');
    }

    try {
      const { data, error: createError } = await supabase
        .from('study_halls')
        .insert({
          ...studyHallData,
          merchant_id: merchantProfile.id,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating study hall:', createError);
        throw new Error('Failed to create study hall');
      }

      setStudyHalls(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Study hall created successfully",
      });

      return data;
    } catch (err) {
      console.error('Error creating study hall:', err);
      toast({
        title: "Error",
        description: "Failed to create study hall",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateStudyHall = async (id: string, updates: Partial<StudyHall>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('study_halls')
        .update(updates)
        .eq('id', id)
        .eq('merchant_id', merchantProfile?.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating study hall:', updateError);
        throw new Error('Failed to update study hall');
      }

      setStudyHalls(prev => prev.map(hall => hall.id === id ? data : hall));
      toast({
        title: "Success",
        description: "Study hall updated successfully",
      });

      return data;
    } catch (err) {
      console.error('Error updating study hall:', err);
      toast({
        title: "Error",
        description: "Failed to update study hall",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteStudyHall = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('study_halls')
        .delete()
        .eq('id', id)
        .eq('merchant_id', merchantProfile?.id);

      if (deleteError) {
        console.error('Error deleting study hall:', deleteError);
        throw new Error('Failed to delete study hall');
      }

      setStudyHalls(prev => prev.filter(hall => hall.id !== id));
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
      throw err;
    }
  };

  useEffect(() => {
    if (merchantProfile) {
      fetchStudyHalls();
    }
  }, [merchantProfile]);

  return {
    studyHalls,
    loading,
    error,
    fetchStudyHalls,
    createStudyHall,
    updateStudyHall,
    deleteStudyHall,
    refetch: fetchStudyHalls,
  };
};
