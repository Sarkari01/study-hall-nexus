
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, TrendingUp, TrendingDown, DollarSign, CreditCard, ArrowUpDown, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import ExportButtons from "@/components/shared/ExportButtons";

interface Transaction {
  id: string;
  transaction_id: string;
  type: 'payment' | 'refund' | 'settlement' | 'fee' | 'bonus';
  reference_id: string;
  reference_type: 'booking' | 'subscription' | 'deposit' | 'withdrawal';
  amount: number;
  fee_amount?: number;
  net_amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  payment_method?: string;
  student_name?: string;
  study_hall?: string;
  description: string;
  created_at: string;
  settled_at?: string;
  gateway_reference?: string;
}

const MerchantTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Mock data - in production, fetch from your API
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          transaction_id: 'TXN1234567890',
          type: 'payment',
          reference_id: 'BK001',
          reference_type: 'booking',
          amount: 400,
          fee_amount: 20,
          net_amount: 380,
          currency: 'INR',
          status: 'completed',
          payment_method: 'UPI',
          student_name: 'Rahul Sharma',
          study_hall: 'Premium Study Room A',
          description: 'Payment for study hall booking',
          created_at: '2024-01-15T10:30:00Z',
          settled_at: '2024-01-15T10:31:00Z',
          gateway_reference: 'GP123456789'
        },
        {
          id: '2',
          transaction_id: 'TXN1234567891',
          type: 'settlement',
          reference_id: 'ST001',
          reference_type: 'booking',
          amount: 1520,
          net_amount: 1520,
          currency: 'INR',
          status: 'completed',
          description: 'Weekly settlement for bookings',
          created_at: '2024-01-16T09:00:00Z',
          settled_at: '2024-01-16T09:01:00Z'
        },
        {
          id: '3',
          transaction_id: 'TXN1234567892',
          type: 'fee',
          reference_id: 'BK002',
          reference_type: 'booking',
          amount: 17.5,
          net_amount: -17.5,
          currency: 'INR',
          status: 'completed',
          description: 'Platform fee for booking',
          created_at: '2024-01-16T14:20:00Z'
        },
        {
          id: '4',
          transaction_id: 'TXN1234567893',
          type: 'payment',
          reference_id: 'BK003',
          reference_type: 'booking',
          amount: 350,
          fee_amount: 17.5,
          net_amount: 332.5,
          currency: 'INR',
          status: 'pending',
          payment_method: 'Credit Card',
          student_name: 'Priya Patel',
          study_hall: 'Deluxe Study Hall B',
          description: 'Payment for study hall booking',
          created_at: '2024-01-17T11:15:00Z'
        },
        {
          id: '5',
          transaction_id: 'TXN1234567894',
          type: 'refund',
          reference_id: 'BK004',
          reference_type: 'booking',
          amount: 400,
          net_amount: -400,
          currency: 'INR',
          status: 'completed',
          payment_method: 'UPI',
          student_name: 'Amit Kumar',
          study_hall: 'Premium Study Room A',
          description: 'Refund for cancelled booking',
          created_at: '2024-01-17T16:30:00Z',
          settled_at: '2024-01-17T16:35:00Z'
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setDateRange({ from: undefined, to: undefined });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-green-100 text-green-800';
      case 'settlement': return 'bg-blue-100 text-blue-800';
      case 'refund': return 'bg-red-100 text-red-800';
      case 'fee': return 'bg-purple-100 text-purple-800';
      case 'bonus': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.student_name && transaction.student_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.study_hall && transaction.study_hall.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    const transactionDate = new Date(transaction.created_at);
    const matchesDateRange = 
      (!dateRange.from || transactionDate >= dateRange.from) &&
      (!dateRange.to || transactionDate <= dateRange.to);
    
    return matchesSearch && matchesType && matchesStatus && matchesDateRange;
  }).sort((a, b) => {
    const aValue = a[sortField as keyof Transaction];
    const bValue = b[sortField as keyof Transaction];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const stats = {
    totalIncome: transactions.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.net_amount, 0),
    totalSettled: transactions.filter(t => t.type === 'settlement' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pendingAmount: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    totalFees: transactions.filter(t => t.type === 'fee').reduce((sum, t) => sum + t.amount, 0),
    totalRefunds: transactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + Math.abs(t.net_amount), 0)
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold">₹{stats.totalIncome.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Settled</p>
                <p className="text-2xl font-bold">₹{stats.totalSettled.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">₹{stats.pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Platform Fees</p>
                <p className="text-2xl font-bold">₹{stats.totalFees.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Refunds</p>
                <p className="text-2xl font-bold">₹{stats.totalRefunds.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" onClick={() => setTypeFilter('all')}>All</TabsTrigger>
          <TabsTrigger value="payments" onClick={() => setTypeFilter('payment')}>Payments</TabsTrigger>
          <TabsTrigger value="settlements" onClick={() => setTypeFilter('settlement')}>Settlements</TabsTrigger>
          <TabsTrigger value="refunds" onClick={() => setTypeFilter('refund')}>Refunds</TabsTrigger>
          <TabsTrigger value="fees" onClick={() => setTypeFilter('fee')}>Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Enhanced Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by transaction ID, description, student, or study hall..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Date Range Filter */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>

                    <Button variant="outline" onClick={clearAllFilters}>
                      <Filter className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
              <ExportButtons 
                data={filteredTransactions}
                filename="merchant-transactions"
                title="Merchant Transactions Report"
              />
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
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('transaction_id')}
                      >
                        <div className="flex items-center">
                          Transaction ID
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('amount')}
                      >
                        <div className="flex items-center">
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('created_at')}
                      >
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-sm">
                          {transaction.transaction_id}
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(transaction.type)}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            {transaction.student_name && (
                              <div className="font-medium">{transaction.student_name}</div>
                            )}
                            {transaction.study_hall && (
                              <div className="text-sm text-gray-500">{transaction.study_hall}</div>
                            )}
                            {!transaction.student_name && !transaction.study_hall && (
                              <div className="text-sm">{transaction.reference_id}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className={`font-medium ${transaction.net_amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.net_amount >= 0 ? '+' : ''}₹{transaction.net_amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {transaction.payment_method ? (
                            <Badge variant="outline">{transaction.payment_method}</Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{new Date(transaction.created_at).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{new Date(transaction.created_at).toLocaleTimeString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MerchantTransactions;
