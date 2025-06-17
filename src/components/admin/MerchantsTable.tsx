import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Edit, Trash2, Plus, Building2, CheckCircle, XCircle, Clock, User, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import MerchantDetailsModal from "./MerchantDetailsModal";

interface AddressData {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface MerchantProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_phone: string;
  business_address: AddressData;
  full_name: string;
  contact_number: string;
  incharge_name?: string;
  incharge_designation?: string;
  incharge_phone?: string;
  incharge_email?: string;
  approval_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  refundable_security_deposit: number;
  created_at: string;
  updated_at: string;
}

const MerchantsTable = () => {
  const [merchants, setMerchants] = useState<MerchantProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | undefined>();
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, userRole, isAuthReady } = useAuth();

  useEffect(() => {
    console.log('MerchantsTable: Component mounted, auth state:', { 
      user: user?.id, 
      role: userRole?.name, 
      isAuthReady 
    });
    
    if (isAuthReady) {
      fetchMerchants();
    }
  }, [user, userRole, isAuthReady]);

  const safeParseJson = (data: any, fallback: any) => {
    if (!data) return fallback;
    if (typeof data === 'object') return data;
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  };

  const fetchMerchants = async () => {
    console.log('MerchantsTable: Starting to fetch merchants...');
    setLoading(true);
    setError(null);
    
    try {
      // Check authentication
      if (!user) {
        throw new Error('Authentication required');
      }

      // Check admin role
      if (userRole?.name !== 'admin') {
        throw new Error('Admin access required');
      }

      const { data, error } = await supabase
        .from('merchant_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('MerchantsTable: Supabase response:', { data, error });

      if (error) {
        console.error('MerchantsTable: Error fetching merchants:', error);
        throw error;
      }

      // Type-cast and parse the data properly
      const typedMerchants: MerchantProfile[] = (data || []).map(merchant => ({
        ...merchant,
        business_address: safeParseJson(merchant.business_address, {
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'India'
        }),
        approval_status: (merchant.approval_status || 'pending') as 'pending' | 'approved' | 'rejected' | 'suspended'
      }));

      console.log('MerchantsTable: Processed merchants:', typedMerchants);
      setMerchants(typedMerchants);
      
      toast({
        title: "Success",
        description: `Loaded ${typedMerchants.length} merchants`,
      });
    } catch (error: any) {
      console.error('MerchantsTable: Error in fetchMerchants:', error);
      setError(error.message || 'Failed to fetch merchants');
      setMerchants([]);
      
      toast({
        title: "Error",
        description: error.message || "Failed to fetch merchants data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMerchant = async (merchantId: string) => {
    if (!confirm("Are you sure you want to delete this merchant?")) return;

    try {
      const { error } = await supabase
        .from('merchant_profiles')
        .delete()
        .eq('id', merchantId);

      if (error) throw error;

      setMerchants(prev => prev.filter(merchant => merchant.id !== merchantId));
      
      toast({
        title: "Success",
        description: "Merchant deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting merchant:', error);
      toast({
        title: "Error",
        description: "Failed to delete merchant",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (merchantId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('merchant_profiles')
        .update({ approval_status: newStatus })
        .eq('id', merchantId);

      if (error) throw error;

      setMerchants(prev => prev.map(merchant => 
        merchant.id === merchantId 
          ? { ...merchant, approval_status: newStatus as any }
          : merchant
      ));

      toast({
        title: "Success",
        description: `Merchant approval status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating merchant status:', error);
      toast({
        title: "Error",
        description: "Failed to update merchant status",
        variant: "destructive",
      });
    }
  };

  const openDetailsModal = (merchantId: string, mode: 'view' | 'edit') => {
    setSelectedMerchantId(merchantId);
    setModalMode(mode);
    setIsDetailsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedMerchantId(undefined);
    setModalMode('create');
    setIsDetailsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800'
    };

    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
      case 'suspended':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = 
      merchant.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.business_phone.includes(searchTerm) ||
      merchant.contact_number.includes(searchTerm) ||
      (merchant.incharge_name && merchant.incharge_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || merchant.approval_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: merchants.length,
    approved: merchants.filter(m => m.approval_status === 'approved').length,
    pending: merchants.filter(m => m.approval_status === 'pending').length,
    rejected: merchants.filter(m => m.approval_status === 'rejected').length,
    suspended: merchants.filter(m => m.approval_status === 'suspended').length
  };

  console.log('MerchantsTable: Rendering with stats:', stats);

  // Show authentication error state
  if (!isAuthReady || loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading merchant data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to access merchant data.</p>
        </div>
      </div>
    );
  }

  if (userRole?.name !== 'admin') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">Admin privileges required to view merchant data.</p>
          <p className="text-sm text-gray-500 mt-2">Current role: {userRole?.name || 'None'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchMerchants} className="bg-emerald-600 hover:bg-emerald-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Merchants</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold">{stats.suspended}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Add Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, business, phone, or contact person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Merchant
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Merchants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Merchants ({filteredMerchants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Details</TableHead>
                    <TableHead>Owner Information</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Security Deposit</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMerchants.map((merchant) => (
                    <TableRow key={merchant.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{merchant.business_name}</div>
                          <div className="text-sm text-gray-500">{merchant.business_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{merchant.full_name}</div>
                          <div className="text-sm text-gray-500">{merchant.contact_number}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {merchant.incharge_name ? (
                            <>
                              <div className="font-medium">{merchant.incharge_name}</div>
                              <div className="text-sm text-gray-500">{merchant.incharge_designation}</div>
                              <div className="text-sm text-gray-500">{merchant.incharge_phone}</div>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">Not specified</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {merchant.business_address?.city && merchant.business_address?.state
                            ? `${merchant.business_address.city}, ${merchant.business_address.state}`
                            : 'Address not provided'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(merchant.approval_status)}
                          <Select
                            value={merchant.approval_status}
                            onValueChange={(value) => handleStatusChange(merchant.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-emerald-600">
                          ₹{merchant.refundable_security_deposit?.toLocaleString() || '0'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(merchant.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openDetailsModal(merchant.id, 'view')}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openDetailsModal(merchant.id, 'edit')}
                            title="Edit Merchant"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteMerchant(merchant.id)}
                            title="Delete Merchant"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredMerchants.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-500 text-lg">No merchants found</p>
                          <p className="text-sm text-gray-400 mt-2">
                            {searchTerm || statusFilter !== 'all' 
                              ? 'Try adjusting your search or filter criteria'
                              : 'Add your first merchant to get started'
                            }
                          </p>
                          {searchTerm === '' && statusFilter === 'all' && (
                            <Button 
                              onClick={openCreateModal} 
                              className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add First Merchant
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Merchant Details Modal */}
      <MerchantDetailsModal
        merchantId={selectedMerchantId}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onMerchantUpdated={fetchMerchants}
        mode={modalMode}
      />
    </div>
  );
};

export default MerchantsTable;
