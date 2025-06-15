
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Search, Filter, Download, Eye, Edit, Trash2, MapPin, Clock, Users, DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExportButtons from "@/components/shared/ExportButtons";

interface Booking {
  id: string;
  bookingId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studyHallName: string;
  merchantName: string;
  location: string;
  seatNumber: string;
  bookingDate: string;
  checkInTime: string;
  checkOutTime: string;
  duration: string;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  bookingStatus: 'confirmed' | 'cancelled' | 'completed' | 'no-show' | 'in-progress';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  notes?: string;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    bookingId: 'BK001',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav@email.com',
    studentPhone: '+91 9876543210',
    studyHallName: 'Central Study Hub',
    merchantName: 'Study Space Solutions',
    location: 'Connaught Place, Delhi',
    seatNumber: 'A-15',
    bookingDate: '2024-01-15',
    checkInTime: '09:00',
    checkOutTime: '17:00',
    duration: '8 hours',
    amount: 250,
    paymentStatus: 'paid',
    bookingStatus: 'completed',
    paymentMethod: 'UPI',
    transactionId: 'TXN123456789',
    createdAt: '2024-01-14T10:30:00Z',
    notes: 'Student preferred window seat'
  },
  {
    id: '2',
    bookingId: 'BK002',
    studentName: 'Priya Patel',
    studentEmail: 'priya@email.com',
    studentPhone: '+91 8765432109',
    studyHallName: 'Elite Learning Center',
    merchantName: 'Premium Study Spaces',
    location: 'Bandra West, Mumbai',
    seatNumber: 'B-08',
    bookingDate: '2024-01-16',
    checkInTime: '10:00',
    checkOutTime: '18:00',
    duration: '8 hours',
    amount: 300,
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN987654321',
    createdAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '3',
    bookingId: 'BK003',
    studentName: 'Rahul Singh',
    studentEmail: 'rahul@email.com',
    studentPhone: '+91 7654321098',
    studyHallName: 'Focus Zone',
    merchantName: 'Study Buddy',
    location: 'Koramangala, Bangalore',
    seatNumber: 'C-12',
    bookingDate: '2024-01-17',
    checkInTime: '08:00',
    checkOutTime: '16:00',
    duration: '8 hours',
    amount: 200,
    paymentStatus: 'failed',
    bookingStatus: 'cancelled',
    paymentMethod: 'UPI',
    transactionId: 'TXN456789123',
    createdAt: '2024-01-16T09:15:00Z',
    notes: 'Payment failed due to insufficient balance'
  }
];

const BookingsTable: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.studyHallName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.merchantName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.bookingStatus === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setDate(today.getDate());
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(booking => 
          new Date(booking.bookingDate) >= filterDate
        );
      }
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, paymentFilter, dateFilter, bookings]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { variant: 'default' as const, icon: CheckCircle },
      completed: { variant: 'default' as const, icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, icon: XCircle },
      'no-show': { variant: 'destructive' as const, icon: XCircle },
      'in-progress': { variant: 'secondary' as const, icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, icon: AlertCircle };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const statusConfig = {
      paid: { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      pending: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      failed: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      refunded: { variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, className: '' };

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, bookingStatus: newStatus as any }
        : booking
    ));
    
    toast({
      title: "Booking Updated",
      description: `Booking status updated to ${newStatus}`,
    });
  };

  const handleRefundBooking = (bookingId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, paymentStatus: 'refunded', bookingStatus: 'cancelled' }
        : booking
    ));
    
    toast({
      title: "Refund Processed",
      description: "Booking has been refunded successfully",
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setDateFilter('all');
  };

  const totalBookings = bookings.length;
  const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed').length;
  const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{confirmedBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status-filter">Booking Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payment-filter">Payment Status</Label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-filter">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <ExportButtons 
                data={filteredBookings} 
                filename="bookings"
                columns={[
                  'bookingId', 'studentName', 'studyHallName', 'bookingDate', 
                  'amount', 'paymentStatus', 'bookingStatus'
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Study Hall</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.bookingId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.studentName}</p>
                        <p className="text-sm text-gray-500">{booking.studentEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.studyHallName}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.location}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.bookingDate}</p>
                        <p className="text-sm text-gray-500">
                          {booking.checkInTime} - {booking.checkOutTime}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">₹{booking.amount}</TableCell>
                    <TableCell>{getPaymentBadge(booking.paymentStatus)}</TableCell>
                    <TableCell>{getStatusBadge(booking.bookingStatus)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewBooking(booking)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select onValueChange={(value) => handleUpdateBookingStatus(booking.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirm</SelectItem>
                            <SelectItem value="completed">Complete</SelectItem>
                            <SelectItem value="cancelled">Cancel</SelectItem>
                            <SelectItem value="no-show">No Show</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details - {selectedBooking?.bookingId}</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Booking Details</TabsTrigger>
                <TabsTrigger value="student">Student Info</TabsTrigger>
                <TabsTrigger value="payment">Payment Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Study Hall</Label>
                    <p className="font-medium">{selectedBooking.studyHallName}</p>
                  </div>
                  <div>
                    <Label>Merchant</Label>
                    <p className="font-medium">{selectedBooking.merchantName}</p>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <p className="font-medium">{selectedBooking.location}</p>
                  </div>
                  <div>
                    <Label>Seat Number</Label>
                    <p className="font-medium">{selectedBooking.seatNumber}</p>
                  </div>
                  <div>
                    <Label>Booking Date</Label>
                    <p className="font-medium">{selectedBooking.bookingDate}</p>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <p className="font-medium">{selectedBooking.duration}</p>
                  </div>
                  <div>
                    <Label>Check-in Time</Label>
                    <p className="font-medium">{selectedBooking.checkInTime}</p>
                  </div>
                  <div>
                    <Label>Check-out Time</Label>
                    <p className="font-medium">{selectedBooking.checkOutTime}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    {getStatusBadge(selectedBooking.bookingStatus)}
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <p className="font-medium">₹{selectedBooking.amount}</p>
                  </div>
                </div>
                {selectedBooking.notes && (
                  <div>
                    <Label>Notes</Label>
                    <p className="text-sm text-gray-600">{selectedBooking.notes}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="student" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Student Name</Label>
                    <p className="font-medium">{selectedBooking.studentName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedBooking.studentEmail}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="font-medium">{selectedBooking.studentPhone}</p>
                  </div>
                  <div>
                    <Label>Booking Created</Label>
                    <p className="font-medium">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Payment Status</Label>
                    {getPaymentBadge(selectedBooking.paymentStatus)}
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <p className="font-medium">{selectedBooking.paymentMethod}</p>
                  </div>
                  <div>
                    <Label>Transaction ID</Label>
                    <p className="font-medium">{selectedBooking.transactionId}</p>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <p className="font-medium">₹{selectedBooking.amount}</p>
                  </div>
                </div>
                
                {selectedBooking.paymentStatus === 'paid' && (
                  <div className="pt-4">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleRefundBooking(selectedBooking.id)}
                    >
                      Process Refund
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsTable;
