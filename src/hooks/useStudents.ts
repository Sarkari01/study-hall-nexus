
import { useState, useEffect } from 'react';
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

// Mock data for now until Supabase types are updated
const mockStudents: Student[] = [
  {
    id: '1',
    student_id: 'STU000001',
    full_name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 9876543210',
    total_bookings: 15,
    status: 'active',
    created_at: '2024-01-15T00:00:00Z',
    last_booking_date: '2024-06-10T00:00:00Z',
    total_spent: '₹3,750',
    average_session_duration: '4.2h',
    preferred_study_halls: ['Central Study Hub', 'Elite Library']
  },
  {
    id: '2',
    student_id: 'STU000002',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 9876543211',
    total_bookings: 8,
    status: 'active',
    created_at: '2024-02-20T00:00:00Z',
    last_booking_date: '2024-06-12T00:00:00Z',
    total_spent: '₹2,160',
    average_session_duration: '3.5h',
    preferred_study_halls: ['Study Zone Pro']
  }
];

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Supabase call once types are updated
      // const { data, error } = await supabase
      //   .from('students')
      //   .select('*')
      //   .order('created_at', { ascending: false });

      // Mock API delay
      setTimeout(() => {
        setStudents(mockStudents);
        setError(null);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students');
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const deleteStudent = async (studentId: string) => {
    try {
      // TODO: Replace with actual Supabase call
      // const { error } = await supabase
      //   .from('students')
      //   .delete()
      //   .eq('id', studentId);

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
      // TODO: Replace with actual Supabase call
      // const { error } = await supabase
      //   .from('students')
      //   .update(updates)
      //   .eq('id', studentId);

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
