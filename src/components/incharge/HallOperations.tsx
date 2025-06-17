
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  QrCode, 
  Clock,
  MapPin,
  Calendar,
  CheckCircle
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface BookingStatus {
  id: string;
  bookingReference: string;
  studentName: string;
  seatId: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'pending' | 'checked_in' | 'checked_out' | 'no_show';
  bookingTime: string;
}

const HallOperations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  // Mock data for demonstration
  const [bookings] = useState<BookingStatus[]>([
    {
      id: '1',
      bookingReference: 'BK-2024-00001',
      studentName: 'Rahul Sharma',
      seatId: 'A01',
      checkInTime: '09:30:00',
      checkOutTime: null,
      status: 'checked_in',
      bookingTime: '09:00-17:00'
    },
    {
      id: '2',
      bookingReference: 'BK-2024-00002',
      studentName: 'Priya Patel',
      seatId: 'A02',
      checkInTime: null,
      checkOutTime: null,
      status: 'pending',
      bookingTime: '10:00-18:00'
    },
    {
      id: '3',
      bookingReference: 'BK-2024-00003',
      studentName: 'Amit Kumar',
      seatId: 'B01',
      checkInTime: '08:45:00',
      checkOutTime: '16:30:00',
      status: 'checked_out',
      bookingTime: '09:00-17:00'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'checked_in': return 'bg-green-100 text-green-800';
      case 'checked_out': return 'bg-blue-100 text-blue-800';
      case 'no_show': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCheckIn = (bookingId: string, studentName: string) => {
    toast({
      title: "Check-in Successful",
      description: `${studentName} has been checked in successfully`,
    });
  };

  const handleCheckOut = (bookingId: string, studentName: string) => {
    toast({
      title: "Check-out Successful",
      description: `${studentName} has been checked out successfully`,
    });
  };

  const handleMarkNoShow = (bookingId: string, studentName: string) => {
    toast({
      title: "Marked as No Show",
      description: `${studentName}'s booking has been marked as no show`,
      variant: "destructive"
    });
  };

  const filteredBookings = bookings.filter(booking => 
    booking.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.seatId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: bookings.length,
    checkedIn: bookings.filter(b => b.status === 'checked_in').length,
    checkedOut: bookings.filter(b => b.status === 'checked_out').length,
    pending: bookings.filter(b => b.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.checkedIn}</div>
                <p className="text-sm text-gray-600">Checked In</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.checkedOut}</div>
                <p className="text-sm text-gray-600">Checked Out</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Hall Operations - Today
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR
              </Button>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student name, booking reference, or seat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{booking.studentName}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-500">Seat: {booking.seatId}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <span>Booking: {booking.bookingReference}</span>
                      <span>Time: {booking.bookingTime}</span>
                      <span>
                        {booking.checkInTime && `Checked in: ${booking.checkInTime}`}
                        {booking.checkOutTime && ` | Checked out: ${booking.checkOutTime}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleCheckIn(booking.id, booking.studentName)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Check In
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkNoShow(booking.id, booking.studentName)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          No Show
                        </Button>
                      </>
                    )}
                    {booking.status === 'checked_in' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckOut(booking.id, booking.studentName)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Check Out
                      </Button>
                    )}
                    {booking.status === 'checked_out' && (
                      <Badge variant="secondary">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HallOperations;
