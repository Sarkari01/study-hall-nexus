import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, MoreHorizontal, Clock, CheckCircle, XCircle, AlertTriangle, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExportButtons from "@/components/shared/ExportButtons";

type TransactionStatus = "eligible" | "processing" | "completed" | "on_hold" | "pending" | "rejected" | "success";

interface Transaction {
  id: string;
  merchantName: string;
  amount: number;
  commission: number;
  netAmount: number;
  date: string;
  status: TransactionStatus;
  paymentMethod: string;
  merchantId: string;
  statusHistory: Array<{
    status: TransactionStatus;
    remark: string;
    changedBy: string;
    changedAt: string;
  }>;
}

const SettleNowTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [newStatus, setNewStatus] = useState<TransactionStatus>("pending");
  const [remark, setRemark] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const mockTransactions: Transaction[] = [
    {
      id: "TXN001",
      merchantName: "Sneha Patel",
      amount: 15000,
      commission: 750,
      netAmount: 14250,
      date: "2024-06-14",
      status: "eligible",
      paymentMethod: "UPI",
      merchantId: "MERCH001",
      statusHistory: [
        {
          status: "eligible",
          remark: "Transaction eligible for settlement",
          changedBy: "System",
          changedAt: "2024-06-14T10:00:00Z"
        }
      ]
    },
    {
      id: "TXN002",
      merchantName: "Rajesh Kumar",
      amount: 8500,
      commission: 425,
      netAmount: 8075,
      date: "2024-06-13",
      status: "processing",
      paymentMethod: "Bank Transfer",
      merchantId: "MERCH002",
      statusHistory: [
        {
          status: "eligible",
          remark: "Initial status",
          changedBy: "System",
          changedAt: "2024-06-13T09:00:00Z"
        },
        {
          status: "processing",
          remark: "Started processing payment",
          changedBy: "Admin",
          changedAt: "2024-06-13T14:30:00Z"
        }
      ]
    }
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          setTransactions(mockTransactions);
          setFilteredTransactions(mockTransactions);
          setLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch transactions",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [toast]);

  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter]);

  const handleStatusChange = async () => {
    if (!selectedTransaction || !remark.trim()) {
      toast({
        title: "Error",
        description: "Please provide a remark for the status change",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedTransactions = transactions.map(transaction => {
        if (transaction.id === selectedTransaction.id) {
          return {
            ...transaction,
            status: newStatus,
            statusHistory: [
              ...transaction.statusHistory,
              {
                status: newStatus,
                remark: remark,
                changedBy: "Admin User",
                changedAt: new Date().toISOString()
              }
            ]
          };
        }
        return transaction;
      });

      setTransactions(updatedTransactions);
      setIsDialogOpen(false);
      setRemark("");
      setSelectedTransaction(null);

      toast({
        title: "Success",
        description: "Transaction status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update transaction status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case "eligible": return <Clock className="h-4 w-4" />;
      case "processing": return <Play className="h-4 w-4" />;
      case "completed": case "success": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      case "on_hold": case "pending": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "eligible": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "completed": case "success": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "on_hold": case "pending": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const openStatusDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewStatus(transaction.status);
    setIsDialogOpen(true);
  };

  const exportData = filteredTransactions.map(transaction => ({
    'Transaction ID': transaction.id,
    'Merchant Name': transaction.merchantName,
    'Amount': `₹${transaction.amount.toLocaleString()}`,
    'Commission': `₹${transaction.commission.toLocaleString()}`,
    'Net Amount': `₹${transaction.netAmount.toLocaleString()}`,
    'Date': transaction.date,
    'Status': transaction.status,
    'Payment Method': transaction.paymentMethod,
    'Current Remark': transaction.statusHistory[transaction.statusHistory.length - 1]?.remark || 'N/A'
  }));

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Settlement Management</CardTitle>
            <ExportButtons 
              data={exportData}
              filename="settlement-transactions"
              title="Settlement Transactions"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by merchant name or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="eligible">Eligible</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.merchantName}</TableCell>
                    <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>₹{transaction.commission.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">₹{transaction.netAmount.toLocaleString()}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(transaction.status)} flex items-center gap-1`}>
                        {getStatusIcon(transaction.status)}
                        {transaction.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStatusDialog(transaction)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Change Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Transaction Status</DialogTitle>
            <DialogDescription>
              Update the status for transaction {selectedTransaction?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={(value: TransactionStatus) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="remark">Remark *</Label>
              <Textarea
                id="remark"
                placeholder="Enter reason for status change..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={3}
              />
            </div>
            {selectedTransaction && (
              <div>
                <Label>Status History</Label>
                <div className="max-h-32 overflow-y-auto space-y-2 mt-2">
                  {selectedTransaction.statusHistory.map((history, index) => (
                    <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                      <div className="flex justify-between">
                        <span className="font-medium">{history.status.replace('_', ' ')}</span>
                        <span className="text-gray-500">{new Date(history.changedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-gray-600">{history.remark}</div>
                      <div className="text-xs text-gray-500">by {history.changedBy}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettleNowTable;
