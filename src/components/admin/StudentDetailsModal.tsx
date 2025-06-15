
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  TrendingUp, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar as CalendarIcon
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  bookingsCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  lastBooking?: string;
  avatar?: string;
  totalSpent?: string;
  averageSessionDuration?: string;
  preferredStudyHalls?: string[];
}

interface Booking {
  id: number;
  studyHall: string;
  seat: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: string;
  status: 'completed' | 'ongoing' | 'cancelled' | 'upcoming';
  paymentMethod: string;
}

interface StudentDetailsModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student, isOpen, onClose }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock bookings data - replace with actual API call
  const mockBookings: Booking[] = [
    {
      id: 1,
      studyHall: "Central Study Hub",
      seat: "A2",
      date: "2024-06-15",
      startTime: "09:00",
      endTime: "13:00",
      duration: 4,
      amount: "₹200",
      status: "ongoing",
      paymentMethod: "UPI"
    },
    {
      id: 2,
      studyHall: "Elite Library",
      seat: "B1",
      date: "2024-06-14",
      startTime: "14:00",
      endTime: "20:00",
      duration: 6,
      amount: "₹270",
      status: "completed",
      paymentMethod: "Card"
    },
    {
      id: 3,
      studyHall: "Study Zone Pro",
      seat: "C3",
      date: "2024-06-13",
      startTime: "10:00",
      endTime: "16:00",
      duration: 6,
      amount: "₹360",
      status: "completed",
      paymentMethod: "UPI"
    },
    {
      id: 4,
      studyHall: "Central Study Hub",
      seat: "A5",
      date: "2024-06-16",
      startTime: "15:00",
      endTime: "19:00",
      duration: 4,
      amount: "₹200",
      status: "upcoming",
      paymentMethod: "Wallet"
    },
    {
      id: 5,
      studyHall: "Elite Library",
      seat: "D2",
      date: "2024-06-10",
      startTime: "09:00",
      endTime: "12:00",
      duration: 3,
      amount: "₹135",
      status: "cancelled",
      paymentMethod: "UPI"
    }
  ];

  useEffect(() => {
    if (student && isOpen) {
      fetchBookings();
    }
  }, [student, isOpen]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get(`/api/admin/students/${student.id}/bookings`);
      // setBookings(response.data);
      
      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      ongoing: { variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      upcoming: { variant: 'outline' as const, icon: AlertCircle, color: 'text-orange-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className={`h-3 w-3 mr-1 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const currentBookings = bookings.filter(b => b.status === 'ongoing' || b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback className="text-lg">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                    <Badge variant={student.status === 'active' ? 'default' : 'destructive'}>
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Joined {student.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold">{student.bookingsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold">{student.totalSpent || '₹1,165'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Avg. Session</p>
                    <p className="text-2xl font-bold">{student.averageSessionDuration || '4.2h'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Last Booking</p>
                    <p className="text-2xl font-bold">{student.lastBooking || 'Never'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Tabs */}
          <Tabs defaultValue="current" className="space-y-4">
            <TabsList>
              <TabsTrigger value="current">Current & Upcoming ({currentBookings.length})</TabsTrigger>
              <TabsTrigger value="past">Past Bookings ({pastBookings.length})</TabsTrigger>
              <TabsTrigger value="all">All Bookings ({bookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <Card>
                <CardHeader>
                  <CardTitle>Current & Upcoming Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : currentBookings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Study Hall</TableHead>
                          <TableHead>Seat</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.studyHall}</TableCell>
                            <TableCell>{booking.seat}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{booking.date}</p>
                                <p className="text-sm text-gray-600">{booking.startTime} - {booking.endTime}</p>
                              </div>
                            </TableCell>
                            <TableCell>{booking.duration}h</TableCell>
                            <TableCell className="font-medium">{booking.amount}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>{booking.paymentMethod}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No current or upcoming bookings
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="past">
              <Card>
                <CardHeader>
                  <CardTitle>Past Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : pastBookings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Study Hall</TableHead>
                          <TableHead>Seat</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.studyHall}</TableCell>
                            <TableCell>{booking.seat}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{booking.date}</p>
                                <p className="text-sm text-gray-600">{booking.startTime} - {booking.endTime}</p>
                              </div>
                            </TableCell>
                            <TableCell>{booking.duration}h</TableCell>
                            <TableCell className="font-medium">{booking.amount}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>{booking.paymentMethod}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No past bookings found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : bookings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Study Hall</TableHead>
                          <TableHead>Seat</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.studyHall}</TableCell>
                            <TableCell>{booking.seat}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{booking.date}</p>
                                <p className="text-sm text-gray-600">{booking.startTime} - {booking.endTime}</p>
                              </div>
                            </TableCell>
                            <TableCell>{booking.duration}h</TableCell>
                            <TableCell className="font-medium">{booking.amount}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>{booking.paymentMethod}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No bookings found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;
