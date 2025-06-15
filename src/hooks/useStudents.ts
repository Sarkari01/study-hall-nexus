
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  total_bookings: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_booking_date?: string;
  total_spent?: string;
  average_session_duration?: string;
  preferred_study_halls?: string[];
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedStudents: Student[] = data.map(student => ({
        id: student.id,
        student_id: student.student_id,
        full_name: student.full_name,
        email: student.email,
        phone: student.phone,
        total_bookings: student.total_bookings || 0,
        status: student.status,
        created_at: student.created_at,
        last_booking_date: student.last_booking_date,
        total_spent: `₹${student.total_spent || 0}`,
        average_session_duration: student.average_session_duration || "0h",
        preferred_study_halls: student.preferred_study_halls || []
      }));

      setStudents(formattedStudents);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students');
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== studentId));
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting student:', err);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const updateStudent = async (studentId: string, updates: Partial<Student>) => {
    try {
      const { error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', studentId);

      if (error) throw error;

      setStudents(prev => prev.map(student => 
        student.id === studentId 
          ? { ...student, ...updates }
          : student
      ));

      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    } catch (err) {
      console.error('Error updating student:', err);
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    deleteStudent,
    updateStudent,
    addStudent: (student: Student) => setStudents(prev => [student, ...prev])
  };
};
