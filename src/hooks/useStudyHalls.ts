
import { useState, useEffect } from 'react';
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

// Mock data
const mockStudyHalls: StudyHall[] = [
  {
    id: '1',
    name: 'Central Study Hub',
    merchant_id: '1',
    description: 'Premium study space with modern amenities',
    location: 'Connaught Place, Delhi',
    capacity: 50,
    price_per_day: 250,
    price_per_week: 1500,
    price_per_month: 5000,
    amenities: ['WiFi', 'AC', 'Parking', 'Library'],
    status: 'active',
    rating: 4.5,
    total_bookings: 1250,
    total_revenue: 125000,
    is_featured: true,
    operating_hours: { open: '06:00', close: '23:00' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z'
  }
];

export const useStudyHalls = () => {
  const [studyHalls, setStudyHalls] = useState<StudyHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStudyHalls = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Supabase call once types are updated
      // const { data, error } = await supabase
      //   .from('study_halls')
      //   .select('*')
      //   .order('created_at', { ascending: false });

      setTimeout(() => {
        setStudyHalls(mockStudyHalls);
        setError(null);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching study halls:', err);
      setError('Failed to fetch study halls');
      toast({
        title: "Error",
        description: "Failed to fetch study halls",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const deleteStudyHall = async (studyHallId: string) => {
    try {
      // TODO: Replace with actual Supabase call
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
      // TODO: Replace with actual Supabase call
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
