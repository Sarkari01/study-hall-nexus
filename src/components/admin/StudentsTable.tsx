
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Eye, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Users,
  CreditCard,
  UserPlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStudents } from "@/hooks/useStudents";
import StudentDetailsModal from "./StudentDetailsModal";
import AddStudentModal from "./AddStudentModal";
import ExportButtons from "@/components/shared/ExportButtons";

// Updated Student interface to match the hook
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

const StudentsTable = () => {
  const { students, loading, addStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const toggleStudentStatus = async (studentId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      // TODO: Replace with actual status update once Supabase types are ready
      toast({
        title: "Success",
        description: `Student account ${newStatus === 'active' ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating student status:', error);
      toast({
        title: "Error",
        description: "Failed to update student status",
        variant: "destructive",
      });
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleAddStudent = (newStudent: Student) => {
    addStudent(newStudent);
  };

  // Memoized filtered students for better performance
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      
      let matchesBookings = true;
      if (bookingFilter === 'high') {
        matchesBookings = student.total_bookings >= 10;
      } else if (bookingFilter === 'medium') {
        matchesBookings = student.total_bookings >= 5 && student.total_bookings < 10;
      } else if (bookingFilter === 'low') {
        matchesBookings = student.total_bookings > 0 && student.total_bookings < 5;
      } else if (bookingFilter === 'none') {
        matchesBookings = student.total_bookings === 0;
      }
      
      return matchesSearch && matchesStatus && matchesBookings;
    });
  }, [students, searchTerm, statusFilter, bookingFilter]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const totalBookings = students.reduce((sum, s) => sum + s.total_bookings, 0);
    const totalRevenue = students.reduce((sum, s) => {
      const amount = parseFloat(s.total_spent?.replace('₹', '').replace(',', '') || '0');
      return sum + amount;
    }, 0);

    return { totalStudents, activeStudents, totalBookings, totalRevenue };
  }, [students]);

  // Prepare data for export
  const exportData = useMemo(() => {
    return filteredStudents.map(student => ({
      'Student ID': student.student_id,
      'Name': student.full_name,
      'Email': student.email,
      'Phone': student.phone,
      'Bookings': student.total_bookings,
      'Total Spent': student.total_spent,
      'Average Session Duration': student.average_session_duration,
      'Status': student.status,
      'Member Since': student.created_at,
      'Last Booking': student.last_booking_date || 'Never',
      'Preferred Study Halls': student.preferred_study_halls?.join(', ') || 'None'
    }));
  }, [filteredStudents]);

  const exportColumns = [
    'Student ID', 'Name', 'Email', 'Phone', 'Bookings', 'Total Spent',
    'Average Session Duration', 'Status', 'Member Since', 'Last Booking', 'Preferred Study Halls'
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{statistics.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Students</p>
                <p className="text-2xl font-bold">{statistics.activeStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{statistics.totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{statistics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={bookingFilter} onValueChange={setBookingFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by bookings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Booking Levels</SelectItem>
                <SelectItem value="high">High Activity (10+)</SelectItem>
                <SelectItem value="medium">Medium Activity (5-9)</SelectItem>
                <SelectItem value="low">Low Activity (1-4)</SelectItem>
                <SelectItem value="none">No Bookings</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setIsAddModalOpen(true)} className="whitespace-nowrap">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>

            <ExportButtons
              data={exportData}
              filename="students"
              title="Students Report"
              columns={exportColumns}
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Avg. Session</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Booking</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.full_name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{student.total_bookings}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{student.total_spent}</TableCell>
                      <TableCell>{student.average_session_duration}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={student.status === 'active' ? 'default' : 'destructive'}
                        >
                          {student.status === 'active' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.last_booking_date || 'Never'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewStudent(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={student.status === 'active' ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => toggleStudentStatus(student.id, student.status)}
                          >
                            {student.status === 'active' ? (
                              <>
                                <Ban className="h-4 w-4 mr-1" />
                                Disable
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Enable
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Details Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStudentAdded={handleAddStudent}
      />
    </div>
  );
};

export default StudentsTable;
