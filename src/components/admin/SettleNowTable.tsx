
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, DollarSign, Clock, CheckCircle, AlertCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PayoutRequest {
  id: number;
  merchantId: string;
  merchantName: string;
  pendingAmount: number;
  availableAmount: number;
  minimumPayout: number;
  lastPayout: string;
  bankAccount: string;
  status: 'eligible' | 'processing' | 'completed' | 'on_hold';
  autoPayoutEnabled: boolean;
  pendingDays: number;
}

const SettleNowTable = () => {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPayouts, setSelectedPayouts] = useState<number[]>([]);
  const { toast } = useToast();

  const mockPayouts: PayoutRequest[] = [
    {
      id: 1,
      merchantId: "MERCH_001",
      merchantName: "Sneha Patel",
      pendingAmount: 15750,
      availableAmount: 14250,
      minimumPayout: 1000,
      lastPayout: "2024-06-07",
      bankAccount: "HDFC Bank ***4567",
      status: 'eligible',
      autoPayoutEnabled: true,
      pendingDays: 7
    },
    {
      id: 2,
      merchantId: "MERCH_002",
      merchantName: "Rajesh Kumar",
      pendingAmount: 8900,
      availableAmount: 8100,
      minimumPayout: 500,
      lastPayout: "2024-06-10",
      bankAccount: "SBI Bank ***8901",
      status: 'eligible',
      autoPayoutEnabled: false,
      pendingDays: 4
    },
    {
      id: 3,
      merchantId: "MERCH_003",
      merchantName: "Amit Singh",
      pendingAmount: 2340,
      availableAmount: 0,
      minimumPayout: 1000,
      lastPayout: "2024-06-12",
      bankAccount: "ICICI Bank ***2345",
      status: 'processing',
      autoPayoutEnabled: true,
      pendingDays: 2
    },
    {
      id: 4,
      merchantId: "MERCH_004",
      merchantName: "Kumar Study Centers",
      pendingAmount: 12500,
      availableAmount: 11800,
      minimumPayout: 2000,
      lastPayout: "2024-06-05",
      bankAccount: "Axis Bank ***6789",
      status: 'on_hold',
      autoPayoutEnabled: false,
      pendingDays: 9
    }
  ];

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setPayouts(mockPayouts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payout data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible': return 'default';
      case 'processing': return 'secondary';
      case 'completed': return 'outline';
      case 'on_hold': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'eligible': return <DollarSign className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'on_hold': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const processPayout = (payoutId: number) => {
    const payout = payouts.find(p => p.id === payoutId);
    if (payout) {
      toast({
        title: "Payout Initiated",
        description: `Processing ₹${payout.availableAmount.toLocaleString()} for ${payout.merchantName}`,
      });
      
      setPayouts(prev => prev.map(p => 
        p.id === payoutId ? { ...p, status: 'processing' as const } : p
      ));
    }
  };

  const processBulkPayouts = () => {
    const eligiblePayouts = payouts.filter(p => 
      selectedPayouts.includes(p.id) && p.status === 'eligible'
    );
    
    if (eligiblePayouts.length === 0) {
      toast({
        title: "No Eligible Payouts",
        description: "Please select eligible payouts to process",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = eligiblePayouts.reduce((sum, p) => sum + p.availableAmount, 0);
    
    toast({
      title: "Bulk Payout Initiated",
      description: `Processing ₹${totalAmount.toLocaleString()} for ${eligiblePayouts.length} merchants`,
    });

    setPayouts(prev => prev.map(p => 
      selectedPayouts.includes(p.id) && p.status === 'eligible' 
        ? { ...p, status: 'processing' as const } 
        : p
    ));
    setSelectedPayouts([]);
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.merchantId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPendingAmount = filteredPayouts.reduce((sum, p) => sum + p.pendingAmount, 0);
  const totalAvailableAmount = filteredPayouts.reduce((sum, p) => sum + p.availableAmount, 0);
  const eligibleCount = filteredPayouts.filter(p => p.status === 'eligible').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Pending</p>
                <p className="text-2xl font-bold">₹{totalPendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available to Pay</p>
                <p className="text-2xl font-bold">₹{totalAvailableAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Eligible Merchants</p>
                <p className="text-2xl font-bold">{eligibleCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold">{filteredPayouts.filter(p => p.status === 'processing').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search merchants..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="eligible">Eligible</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={processBulkPayouts} 
              disabled={selectedPayouts.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Process Selected ({selectedPayouts.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Merchant Payouts</CardTitle>
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
                  <TableHead className="w-12">
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPayouts(filteredPayouts.map(p => p.id));
                        } else {
                          setSelectedPayouts([]);
                        }
                      }}
                      checked={selectedPayouts.length === filteredPayouts.length && filteredPayouts.length > 0}
                    />
                  </TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Pending Amount</TableHead>
                  <TableHead>Available Amount</TableHead>
                  <TableHead>Bank Account</TableHead>
                  <TableHead>Last Payout</TableHead>
                  <TableHead>Days Pending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <input 
                        type="checkbox" 
                        checked={selectedPayouts.includes(payout.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPayouts(prev => [...prev, payout.id]);
                          } else {
                            setSelectedPayouts(prev => prev.filter(id => id !== payout.id));
                          }
                        }}
                        disabled={payout.status !== 'eligible'}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payout.merchantName}</div>
                        <div className="text-sm text-gray-500">{payout.merchantId}</div>
                        {payout.autoPayoutEnabled && (
                          <Badge variant="outline" className="text-xs mt-1">Auto Payout</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-orange-600">
                        ₹{payout.pendingAmount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">
                        ₹{payout.availableAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: ₹{payout.minimumPayout.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{payout.bankAccount}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{payout.lastPayout}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={payout.pendingDays > 7 ? "destructive" : "secondary"}>
                        {payout.pendingDays} days
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(payout.status)}
                        <Badge variant={getStatusColor(payout.status)} className="ml-2">
                          {payout.status.replace('_', ' ').charAt(0).toUpperCase() + payout.status.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        onClick={() => processPayout(payout.id)}
                        disabled={payout.status !== 'eligible' || payout.availableAmount < payout.minimumPayout}
                        variant={payout.status === 'eligible' ? "default" : "outline"}
                      >
                        {payout.status === 'eligible' ? 'Pay Now' : 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettleNowTable;
