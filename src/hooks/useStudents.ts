
import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  total_spent: number;
  total_bookings: number;
  average_session_duration: string;
  last_booking_date: string | null;
  preferred_study_halls: string[];
  created_at: string;
  updated_at: string;
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, userRole, isAuthReady } = useAuth();
  const isMountedRef = useRef(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useStudents: Starting fetch, user:', user?.id, 'role:', userRole?.name);
      
      // Check authentication
      if (!user || !isAuthReady) {
        console.log('useStudents: User not authenticated or auth not ready');
        if (isMountedRef.current) {
          setStudents([]);
          setError('Authentication required');
          setLoading(false);
        }
        return;
      }

      // Check admin role
      if (userRole?.name !== 'admin') {
        console.log('useStudents: User does not have admin role:', userRole?.name);
        if (isMountedRef.current) {
          setStudents([]);
          setError('Admin access required');
          setLoading(false);
        }
        return;
      }
      
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('useStudents: Students response:', { data: studentsData, error: studentsError });

      if (studentsError) {
        console.error('useStudents: Error fetching students:', studentsError);
        throw studentsError;
      }

      // Type assertion to ensure proper typing
      const typedStudents = (studentsData || []).map(student => ({
        ...student,
        status: student.status as 'active' | 'inactive' | 'suspended'
      }));

      console.log('useStudents: Final processed students:', typedStudents);

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setStudents(typedStudents);
        setError(null);
        
        toast({
          title: "Success",
          description: `Loaded ${typedStudents.length} students`,
        });
      }
    } catch (err) {
      console.error('useStudents: Error in fetchStudents:', err);
      if (isMountedRef.current) {
        setError('Failed to fetch students');
        setStudents([]);
        toast({
          title: "Error",
          description: "Failed to fetch students. Please check your permissions.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const updateStudent = async (studentId: string, updates: Partial<Student>) => {
    try {
      console.log('useStudents: Updating student:', studentId, updates);
      
      const { error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', studentId);

      if (error) throw error;

      if (isMountedRef.current) {
        setStudents(prev => prev.map(student => 
          student.id === studentId 
            ? { ...student, ...updates }
            : student
        ));

        toast({
          title: "Success",
          description: "Student updated successfully",
        });
      }
    } catch (err) {
      console.error('useStudents: Error updating student:', err);
      if (isMountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to update student",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    // Only fetch when auth is ready
    if (isAuthReady) {
      fetchStudents();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user, userRole, isAuthReady]);

  return {
    students,
    loading,
    error,
    fetchStudents,
    updateStudent
  };
};
