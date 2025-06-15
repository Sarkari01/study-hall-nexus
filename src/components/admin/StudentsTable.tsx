import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Eye, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Download, 
  Filter, 
  Calendar,
  TrendingUp,
  Users,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StudentDetailsModal from "./StudentDetailsModal";
import PermissionChecker from "./PermissionChecker";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  bookingsCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  lastBooking?: string;
  totalSpent?: string;
  averageSessionDuration?: string;
  preferredStudyHalls?: string[];
}

const StudentsTable = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Enhanced mock data with more details
  const mockStudents: Student[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 9876543210",
      bookingsCount: 15,
      status: 'active',
      createdAt: "2024-01-15",
      lastBooking: "2024-06-10",
      totalSpent: "₹3,750",
      averageSessionDuration: "4.2h",
      preferredStudyHalls: ["Central Study Hub", "Elite Library"]
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 9876543211",
      bookingsCount: 8,
      status: 'active',
      createdAt: "2024-02-20",
      lastBooking: "2024-06-12",
      totalSpent: "₹2,160",
      averageSessionDuration: "3.5h",
      preferredStudyHalls: ["Study Zone Pro"]
    },
    {
      id: 3,
      name: "Amit Singh",
      email: "amit.singh@email.com",
      phone: "+91 9876543212",
      bookingsCount: 3,
      status: 'inactive',
      createdAt: "2024-03-10",
      lastBooking: "2024-05-15",
      totalSpent: "₹810",
      averageSessionDuration: "2.8h",
      preferredStudyHalls: ["Central Study Hub"]
    },
    {
      id: 4,
      name: "Sneha Patel",
      email: "sneha.patel@email.com",
      phone: "+91 9876543213",
      bookingsCount: 22,
      status: 'active',
      createdAt: "2024-01-05",
      lastBooking: "2024-06-14",
      totalSpent: "₹5,940",
      averageSessionDuration: "5.1h",
      preferredStudyHalls: ["Elite Library", "Study Zone Pro", "Central Study Hub"]
    },
    {
      id: 5,
      name: "Arjun Reddy",
      email: "arjun.reddy@email.com",
      phone: "+91 9876543214",
      bookingsCount: 12,
      status: 'active',
      createdAt: "2024-02-01",
      lastBooking: "2024-06-13",
      totalSpent: "₹3,240",
      averageSessionDuration: "4.0h",
      preferredStudyHalls: ["Central Study Hub"]
    },
    {
      id: 6,
      name: "Kavya Nair",
      email: "kavya.nair@email.com",
      phone: "+91 9876543215",
      bookingsCount: 0,
      status: 'active',
      createdAt: "2024-06-10",
      lastBooking: undefined,
      totalSpent: "₹0",
      averageSessionDuration: "0h",
      preferredStudyHalls: []
    }
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get('/api/admin/students');
      // setStudents(response.data);
      
      // Mock API delay
      setTimeout(() => {
        setStudents(mockStudents);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch students data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const toggleStudentStatus = async (studentId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      // TODO: Replace with actual API call
      // await axios.patch(`/api/admin/students/${studentId}/status`, { status: newStatus });
      
      setStudents(students.map(student => 
        student.id === studentId 
          ? { ...student, status: newStatus as 'active' | 'inactive' }
          : student
      ));

      toast({
        title: "Success",
        description: `Student account ${newStatus === 'active' ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student status",
        variant: "destructive",
      });
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleExportStudents = () => {
    // TODO: Implement actual export functionality
    toast({
      title: "Export Started",
      description: "Student data export will be ready shortly",
    });
  };

  const handleBulkAction = (action: string, selectedIds: number[]) => {
    // TODO: Implement bulk actions
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedIds.length} students`,
    });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    let matchesBookings = true;
    if (bookingFilter === 'high') {
      matchesBookings = student.bookingsCount >= 10;
    } else if (bookingFilter === 'medium') {
      matchesBookings = student.bookingsCount >= 5 && student.bookingsCount < 10;
    } else if (bookingFilter === 'low') {
      matchesBookings = student.bookingsCount > 0 && student.bookingsCount < 5;
    } else if (bookingFilter === 'none') {
      matchesBookings = student.bookingsCount === 0;
    }
    
    return matchesSearch && matchesStatus && matchesBookings;
  });

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalBookings = students.reduce((sum, s) => sum + s.bookingsCount, 0);
  const totalRevenue = students.reduce((sum, s) => {
    const amount = parseFloat(s.totalSpent?.replace('₹', '').replace(',', '') || '0');
    return sum + amount;
  }, 0);

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
                <p className="text-2xl font-bold">{totalStudents}</p>
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
                <p className="text-2xl font-bold">{activeStudents}</p>
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
                <p className="text-2xl font-bold">{totalBookings}</p>
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
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
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

            <PermissionChecker permission="students.export">
              <Button onClick={handleExportStudents} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </PermissionChecker>
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
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.bookingsCount}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{student.totalSpent}</TableCell>
                    <TableCell>{student.averageSessionDuration}</TableCell>
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
                    <TableCell>{student.lastBooking || 'Never'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <PermissionChecker permission="students.read">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewStudent(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </PermissionChecker>
                        <PermissionChecker permission="students.write">
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
                        </PermissionChecker>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Student Details Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default StudentsTable;
