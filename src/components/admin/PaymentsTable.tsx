
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, CreditCard, Users, Building2, Calendar, Edit2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: number;
  user: string;
  userEmail: string;
  amount: number;
  method: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cash';
  studyHall: string;
  merchant: string;
  status: 'paid' | 'unpaid' | 'cash' | 'failed' | 'refunded';
  transactionId: string;
  date: string;
  bookingPeriod: string;
}

const PaymentsTable = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const { toast } = useToast();

  // Mock data for payments
  const mockPayments: Payment[] = [
    {
      id: 1,
      user: "Rajesh Kumar",
      userEmail: "rajesh.student@email.com",
      amount: 150,
      method: 'upi',
      studyHall: "Premium Study Lounge",
      merchant: "Sneha Patel",
      status: 'paid',
      transactionId: "TXN001234567890",
      date: "2024-06-14 10:30 AM",
      bookingPeriod: "3 hours"
    },
    {
      id: 2,
      user: "Priya Sharma",
      userEmail: "priya.s@email.com",
      amount: 200,
      method: 'card',
      studyHall: "Kumar Study Centers",
      merchant: "Rajesh Kumar",
      status: 'paid',
      transactionId: "TXN001234567891",
      date: "2024-06-14 09:15 AM",
      bookingPeriod: "1 day"
    },
    {
      id: 3,
      user: "Amit Singh",
      userEmail: "amit.singh.student@email.com",
      amount: 75,
      method: 'wallet',
      studyHall: "Tech Park Study Space",
      merchant: "Amit Singh",
      status: 'unpaid',
      transactionId: "TXN001234567892",
      date: "2024-06-14 08:45 AM",
      bookingPeriod: "1.5 hours"
    },
    {
      id: 4,
      user: "Sneha Patel",
      userEmail: "sneha.p.student@email.com",
      amount: 3000,
      method: 'netbanking',
      studyHall: "Student Study Zone",
      merchant: "Sneha Patel",
      status: 'paid',
      transactionId: "TXN001234567893",
      date: "2024-06-13 02:20 PM",
      bookingPeriod: "1 month"
    },
    {
      id: 5,
      user: "Vikram Yadav",
      userEmail: "vikram.y@email.com",
      amount: 100,
      method: 'cash',
      studyHall: "Premium Study Lounge",
      merchant: "Sneha Patel",
      status: 'cash',
      transactionId: "CASH001234567894",
      date: "2024-06-13 11:30 AM",
      bookingPeriod: "2 hours"
    },
    {
      id: 6,
      user: "Anita Desai",
      userEmail: "anita.desai@email.com",
      amount: 250,
      method: 'card',
      studyHall: "Kumar Study Centers",
      merchant: "Rajesh Kumar",
      status: 'refunded',
      transactionId: "TXN001234567895",
      date: "2024-06-12 04:15 PM",
      bookingPeriod: "5 hours"
    }
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get('/api/admin/payments');
      // setPayments(response.data);
      
      setTimeout(() => {
        setPayments(mockPayments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payments data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'cash': return 'default';
      case 'unpaid': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'cash': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'unpaid': return <Clock className="h-3 w-3 mr-1" />;
      case 'failed': return <XCircle className="h-3 w-3 mr-1" />;
      case 'refunded': return <XCircle className="h-3 w-3 mr-1" />;
      default: return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4 mr-1" />;
      case 'upi': return <CreditCard className="h-4 w-4 mr-1" />;
      case 'netbanking': return <CreditCard className="h-4 w-4 mr-1" />;
      case 'wallet': return <CreditCard className="h-4 w-4 mr-1" />;
      case 'cash': return <CreditCard className="h-4 w-4 mr-1" />;
      default: return <CreditCard className="h-4 w-4 mr-1" />;
    }
  };

  const handleUpdateStatus = (payment: Payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status);
    setIsUpdateDialogOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (!selectedPayment || !newStatus) return;

    setPayments(prev => prev.map(payment => 
      payment.id === selectedPayment.id 
        ? { ...payment, status: newStatus as any }
        : payment
    ));

    toast({
      title: "Payment Status Updated",
      description: `Payment status changed to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
    });

    setIsUpdateDialogOpen(false);
    setSelectedPayment(null);
    setNewStatus('');
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.studyHall.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by user, email, study hall, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="netbanking">Net Banking</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
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
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Study Hall</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium">{payment.user}</div>
                          <div className="text-sm text-gray-500">{payment.userEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">₹{payment.amount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getMethodIcon(payment.method)}
                        <span className="capitalize">{payment.method}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                        {payment.studyHall}
                      </div>
                    </TableCell>
                    <TableCell>{payment.merchant}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {payment.bookingPeriod}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(payment.status)} className="flex items-center w-fit">
                        {getStatusIcon(payment.status)}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{payment.date}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {payment.transactionId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(payment)}
                        className="flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              Change the payment status for {selectedPayment?.user}'s transaction of ₹{selectedPayment?.amount}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Status</label>
              <p className="text-sm text-gray-600 capitalize">{selectedPayment?.status}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusUpdate} disabled={!newStatus || newStatus === selectedPayment?.status}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsTable;
