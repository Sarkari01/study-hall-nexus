
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Wallet, TrendingUp, Users, IndianRupee, CreditCard, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  reward_points: number;
  total_earned: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
  user_profiles?: {
    full_name: string;
    phone: string;
    role: string;
  };
}

interface WalletTransaction {
  id: string;
  wallet_id: string;
  user_id: string;
  transaction_type: 'credit' | 'debit' | 'reward' | 'refund' | 'topup';
  amount: number;
  points: number;
  description: string;
  reference_id: string | null;
  reference_type: string | null;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
}

const WalletManagement = () => {
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'wallets' | 'transactions'>('wallets');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<UserWallet | null>(null);
  const { toast } = useToast();

  const [transactionForm, setTransactionForm] = useState({
    transaction_type: 'credit' as WalletTransaction['transaction_type'],
    amount: 0,
    points: 0,
    description: '',
    reference_id: '',
    reference_type: ''
  });

  useEffect(() => {
    fetchWallets();
    fetchTransactions();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Use mock data since user_profiles relation doesn't exist yet
      const walletsWithProfiles = (data || []).map(wallet => ({
        ...wallet,
        user_profiles: {
          full_name: `User ${wallet.user_id.slice(0, 8)}`,
          phone: '+91 9876543210',
          role: 'student'
        }
      }));
      
      setWallets(walletsWithProfiles);
    } catch (error: any) {
      console.error('Error fetching wallets:', error);
      // Use mock data if tables don't exist yet
      setWallets([
        {
          id: '1',
          user_id: 'user1',
          balance: 1500.50,
          reward_points: 250,
          total_earned: 2000.00,
          total_spent: 499.50,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          user_profiles: {
            full_name: 'John Doe',
            phone: '+91 9876543210',
            role: 'student'
          }
        },
        {
          id: '2',
          user_id: 'user2',
          balance: 750.00,
          reward_points: 100,
          total_earned: 1000.00,
          total_spent: 250.00,
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          user_profiles: {
            full_name: 'Jane Smith',
            phone: '+91 9876543211',
            role: 'merchant'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Type cast the data to match our interface
      const typedTransactions = (data || []).map(transaction => ({
        ...transaction,
        transaction_type: transaction.transaction_type as WalletTransaction['transaction_type'],
        status: transaction.status as WalletTransaction['status']
      }));
      
      setTransactions(typedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      // Use mock data if tables don't exist yet
      setTransactions([
        {
          id: '1',
          wallet_id: '1',
          user_id: 'user1',
          transaction_type: 'credit',
          amount: 500.00,
          points: 0,
          description: 'Admin credit adjustment',
          reference_id: null,
          reference_type: null,
          status: 'completed',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          wallet_id: '1',
          user_id: 'user1',
          transaction_type: 'reward',
          amount: 100.00,
          points: 50,
          description: 'Sign up bonus reward',
          reference_id: 'signup_001',
          reference_type: 'reward',
          status: 'completed',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;
    
    try {
      const transactionData = {
        wallet_id: selectedWallet.id,
        user_id: selectedWallet.user_id,
        ...transactionForm,
        created_by: '00000000-0000-0000-0000-000000000000' // Mock admin user
      };

      const { error } = await supabase
        .from('wallet_transactions')
        .insert([transactionData]);

      if (error) throw error;

      // Update wallet balance
      const balanceChange = transactionForm.transaction_type === 'credit' || transactionForm.transaction_type === 'reward' || transactionForm.transaction_type === 'refund'
        ? transactionForm.amount
        : -transactionForm.amount;

      const pointsChange = transactionForm.transaction_type === 'reward'
        ? transactionForm.points
        : 0;

      const { error: walletError } = await supabase
        .from('user_wallets')
        .update({
          balance: selectedWallet.balance + balanceChange,
          reward_points: selectedWallet.reward_points + pointsChange,
          total_earned: transactionForm.transaction_type === 'credit' || transactionForm.transaction_type === 'reward' || transactionForm.transaction_type === 'refund'
            ? selectedWallet.total_earned + transactionForm.amount
            : selectedWallet.total_earned,
          total_spent: transactionForm.transaction_type === 'debit'
            ? selectedWallet.total_spent + transactionForm.amount
            : selectedWallet.total_spent
        })
        .eq('id', selectedWallet.id);

      if (walletError) throw walletError;

      toast({
        title: "Success",
        description: "Transaction added successfully",
      });

      setDialogOpen(false);
      setSelectedWallet(null);
      resetForm();
      fetchWallets();
      fetchTransactions();
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTransactionForm({
      transaction_type: 'credit',
      amount: 0,
      points: 0,
      description: '',
      reference_id: '',
      reference_type: ''
    });
  };

  const getTransactionTypeColor = (type: string) => {
    const colors = {
      credit: 'bg-green-100 text-green-800',
      debit: 'bg-red-100 text-red-800',
      reward: 'bg-blue-100 text-blue-800',
      refund: 'bg-yellow-100 text-yellow-800',
      topup: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredWallets = wallets.filter(wallet => 
    wallet.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.user_profiles?.phone?.includes(searchTerm) ||
    wallet.user_id.includes(searchTerm)
  );

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.user_id.includes(searchTerm) ||
    transaction.reference_id?.includes(searchTerm)
  );

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const totalPoints = wallets.reduce((sum, wallet) => sum + wallet.reward_points, 0);
  const totalEarned = wallets.reduce((sum, wallet) => sum + wallet.total_earned, 0);
  const totalSpent = wallets.reduce((sum, wallet) => sum + wallet.total_spent, 0);

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Wallets</p>
                <p className="text-2xl font-bold">{wallets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <IndianRupee className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold">₹{totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold">₹{totalEarned.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4 mb-4">
            <Button
              variant={activeTab === 'wallets' ? 'default' : 'outline'}
              onClick={() => setActiveTab('wallets')}
            >
              <Wallet className="h-4 w-4 mr-2" />
              User Wallets
            </Button>
            <Button
              variant={activeTab === 'transactions' ? 'default' : 'outline'}
              onClick={() => setActiveTab('transactions')}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Transactions
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={activeTab === 'wallets' ? "Search users..." : "Search transactions..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallets Table */}
      {activeTab === 'wallets' && (
        <Card>
          <CardHeader>
            <CardTitle>User Wallets ({filteredWallets.length})</CardTitle>
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
                    <TableHead>Role</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Total Earned</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{wallet.user_profiles?.full_name || 'Unknown User'}</div>
                          <div className="text-sm text-gray-500">{wallet.user_profiles?.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {wallet.user_profiles?.role || 'student'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">₹{wallet.balance.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{wallet.reward_points}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-green-600">₹{wallet.total_earned.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-red-600">₹{wallet.total_spent.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Dialog open={dialogOpen && selectedWallet?.id === wallet.id} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (!open) setSelectedWallet(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedWallet(wallet);
                                resetForm();
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Transaction
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Transaction - {wallet.user_profiles?.full_name}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddTransaction} className="space-y-4">
                              <div>
                                <Label htmlFor="transaction_type">Transaction Type</Label>
                                <Select value={transactionForm.transaction_type} onValueChange={(value: WalletTransaction['transaction_type']) => setTransactionForm({...transactionForm, transaction_type: value})}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="credit">Credit</SelectItem>
                                    <SelectItem value="debit">Debit</SelectItem>
                                    <SelectItem value="reward">Reward</SelectItem>
                                    <SelectItem value="refund">Refund</SelectItem>
                                    <SelectItem value="topup">Top Up</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="amount">Amount (₹)</Label>
                                  <Input
                                    id="amount"
                                    type="number"
                                    value={transactionForm.amount}
                                    onChange={(e) => setTransactionForm({...transactionForm, amount: parseFloat(e.target.value)})}
                                    min="0"
                                    step="0.01"
                                    required
                                  />
                                </div>
                                {transactionForm.transaction_type === 'reward' && (
                                  <div>
                                    <Label htmlFor="points">Points</Label>
                                    <Input
                                      id="points"
                                      type="number"
                                      value={transactionForm.points}
                                      onChange={(e) => setTransactionForm({...transactionForm, points: parseInt(e.target.value)})}
                                      min="0"
                                    />
                                  </div>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                  id="description"
                                  value={transactionForm.description}
                                  onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                                  placeholder="Reason for transaction"
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="reference_id">Reference ID (Optional)</Label>
                                  <Input
                                    id="reference_id"
                                    value={transactionForm.reference_id}
                                    onChange={(e) => setTransactionForm({...transactionForm, reference_id: e.target.value})}
                                    placeholder="booking_001"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="reference_type">Reference Type (Optional)</Label>
                                  <Input
                                    id="reference_type"
                                    value={transactionForm.reference_type}
                                    onChange={(e) => setTransactionForm({...transactionForm, reference_type: e.target.value})}
                                    placeholder="booking"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  Add Transaction
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      {activeTab === 'transactions' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="text-sm">{format(new Date(transaction.created_at), "MMM dd, yyyy HH:mm")}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{transaction.user_id.slice(0, 8)}...</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTransactionTypeColor(transaction.transaction_type)}>
                        {transaction.transaction_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${
                        transaction.transaction_type === 'debit' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.transaction_type === 'debit' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.points > 0 && (
                        <div className="font-medium text-blue-600">+{transaction.points}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{transaction.description}</div>
                      {transaction.reference_id && (
                        <div className="text-xs text-gray-500">Ref: {transaction.reference_id}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletManagement;
