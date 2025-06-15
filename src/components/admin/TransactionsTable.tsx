import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowUpDown, Eye, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ExportButtons from "@/components/shared/ExportButtons";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  reference_type: string;
  reference_id: string;
  transaction_type: string;
  created_at: string;
  user_id: string;
}

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion to ensure status field matches our interface
      const typedTransactions = (data || []).map(transaction => ({
        ...transaction,
        status: transaction.status as 'completed' | 'pending' | 'failed' | 'cancelled'
      }));

      setTransactions(typedTransactions);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'credit': return 'bg-green-100 text-green-800';
      case 'debit': return 'bg-red-100 text-red-800';
      case 'refund': return 'bg-orange-100 text-orange-800';
      case 'payment': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.reference_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || transaction.transaction_type === typeFilter;
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof Transaction];
      const bValue = b[sortField as keyof Transaction];
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * multiplier;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * multiplier;
      }
      return 0;
    });

  const exportColumns = ['id', 'transaction_type', 'amount', 'status', 'description', 'created_at', 'reference_type', 'reference_id'];

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
              </SelectContent>
            </Select>
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
            <ExportButtons 
              data={filteredTransactions} 
              filename="transactions" 
              title="Transaction Ledger"
              columns={exportColumns}
            />
            <Button onClick={fetchTransactions} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Ledger ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                      Transaction ID <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('transaction_type')}>
                      Type <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                      Amount <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                      Status <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                      Date <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {transaction.id.slice(-8)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(transaction.transaction_type)}>
                          {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">₹{transaction.amount.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="text-sm">{transaction.description}</div>
                          {transaction.reference_id && (
                            <div className="text-xs text-gray-500">Ref: {transaction.reference_id}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(transaction.status)}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{new Date(transaction.created_at).toLocaleDateString()}</div>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsTable;
