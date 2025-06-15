
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Edit, Trash2, Plus, Building2, CheckCircle, XCircle, Clock, FileText, User, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  approval_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verification_status: 'unverified' | 'pending' | 'verified';
  onboarding_completed: boolean;
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
  const { toast } = useToast();

  useEffect(() => {
    fetchMerchants();
  }, []);

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
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('merchant_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

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
        approval_status: (merchant.approval_status || 'pending') as 'pending' | 'approved' | 'rejected' | 'suspended',
        verification_status: (merchant.verification_status || 'unverified') as 'unverified' | 'pending' | 'verified'
      }));

      setMerchants(typedMerchants);
    } catch (error) {
      console.error('Error fetching merchants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch merchants data",
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

  const handleStatusChange = async (merchantId: string, newStatus: string, field: 'approval_status' | 'verification_status') => {
    try {
      const { error } = await supabase
        .from('merchant_profiles')
        .update({ [field]: newStatus })
        .eq('id', merchantId);

      if (error) throw error;

      setMerchants(prev => prev.map(merchant => 
        merchant.id === merchantId 
          ? { ...merchant, [field]: newStatus as any }
          : merchant
      ));

      toast({
        title: "Success",
        description: `Merchant ${field.replace('_', ' ')} updated to ${newStatus}`,
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

  const getStatusColor = (status: string, type: 'approval' | 'verification') => {
    const colors = {
      approval: {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        suspended: 'bg-gray-100 text-gray-800'
      },
      verification: {
        unverified: 'bg-gray-100 text-gray-800',
        pending: 'bg-yellow-100 text-yellow-800',
        verified: 'bg-green-100 text-green-800'
      }
    };

    return colors[type][status as keyof typeof colors[typeof type]] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
      case 'suspended':
      case 'unverified':
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
      merchant.contact_number.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || merchant.approval_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: merchants.length,
    approved: merchants.filter(m => m.approval_status === 'approved').length,
    pending: merchants.filter(m => m.approval_status === 'pending').length,
    rejected: merchants.filter(m => m.approval_status === 'rejected').length,
    verified: merchants.filter(m => m.verification_status === 'verified').length
  };

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
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold">{stats.verified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search merchants by name, business, or phone..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={openCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Merchant
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Merchants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Merchants ({filteredMerchants.length})</CardTitle>
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
                  <TableHead>Business Info</TableHead>
                  <TableHead>Owner Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Approval Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Deposit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{merchant.business_name}</div>
                        <div className="text-sm text-gray-500">{merchant.business_phone}</div>
                        <div className="flex items-center mt-1">
                          {merchant.onboarding_completed ? (
                            <Badge variant="secondary" className="text-xs">Onboarded</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Pending Onboarding</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{merchant.full_name}</div>
                        <div className="text-sm text-gray-500">{merchant.contact_number}</div>
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
                      <div className="text-sm">
                        {merchant.business_address?.city || 'Not specified'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(merchant.approval_status)}
                        <Select
                          value={merchant.approval_status}
                          onValueChange={(value) => handleStatusChange(merchant.id, value, 'approval_status')}
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
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(merchant.verification_status)}
                        <Select
                          value={merchant.verification_status}
                          onValueChange={(value) => handleStatusChange(merchant.id, value, 'verification_status')}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unverified">Unverified</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">
                        ₹{merchant.refundable_security_deposit?.toLocaleString() || '0'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
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
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMerchants.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No merchants found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filter criteria'
                            : 'Add your first merchant to get started'
                          }
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
