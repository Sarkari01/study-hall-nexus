import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Edit, Trash2, Download, AlertTriangle } from "lucide-react";
import { useMerchants } from "@/hooks/useMerchants";
import { useAuth } from '@/contexts/AuthContext';
import MerchantDetailsModal from "./MerchantDetailsModal";
import AddMerchantModal from "./AddMerchantModal";
import EditMerchantModal from "./EditMerchantModal";
import ErrorBoundary from "./ErrorBoundary";
import { useToast } from "@/hooks/use-toast";

const MerchantsTable = () => {
  const { merchants, loading, error, fetchMerchants, createMerchant, updateMerchant, deleteMerchant } = useMerchants();
  const { user, userRole, isAuthReady } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('MerchantsTable: Component mounted/updated');
    console.log('MerchantsTable: isAuthReady:', isAuthReady);
    console.log('MerchantsTable: user:', user);
    console.log('MerchantsTable: userRole:', userRole);
    console.log('MerchantsTable: merchants:', merchants);
    console.log('MerchantsTable: loading:', loading);
    console.log('MerchantsTable: error:', error);
  }, [isAuthReady, user, userRole, merchants, loading, error]);

  // Trigger fetch when auth is ready
  useEffect(() => {
    if (isAuthReady && user && userRole?.name === 'admin') {
      console.log('MerchantsTable: Triggering fetchMerchants');
      fetchMerchants();
    }
  }, [isAuthReady, user, userRole, fetchMerchants]);

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.business_phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || merchant.approval_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (merchant: any) => {
    setSelectedMerchant(merchant);
    setIsDetailsModalOpen(true);
  };

  const handleEditMerchant = (merchant: any) => {
    setSelectedMerchant(merchant);
    setIsEditModalOpen(true);
  };

  const handleDeleteMerchant = async (merchant: any) => {
    if (window.confirm(`Are you sure you want to delete ${merchant.business_name}? This action cannot be undone.`)) {
      try {
        await deleteMerchant(merchant.id);
      } catch (error) {
        console.error('Error deleting merchant:', error);
      }
    }
  };

  const handleUpdateStatus = async (merchantId: string, status: 'approved' | 'rejected') => {
    try {
      await updateMerchant(merchantId, { approval_status: status });
      setIsDetailsModalOpen(false);
      setSelectedMerchant(null);
    } catch (error) {
      console.error('Error updating merchant status:', error);
    }
  };

  const handleCreateMerchant = async (merchantData: any) => {
    try {
      await createMerchant(merchantData);
    } catch (error) {
      console.error('Error creating merchant:', error);
    }
  };

  const handleUpdateMerchant = async (merchantId: string, updates: any) => {
    try {
      await updateMerchant(merchantId, updates);
    } catch (error) {
      console.error('Error updating merchant:', error);
    }
  };

  const exportMerchants = () => {
    const csvContent = [
      ['Business Name', 'Owner', 'Business Phone', 'Contact', 'Status', 'Study Halls', 'Revenue', 'Joined'],
      ...filteredMerchants.map(merchant => [
        merchant.business_name,
        merchant.full_name,
        merchant.business_phone,
        merchant.contact_number,
        merchant.approval_status,
        merchant.total_study_halls || 0,
        merchant.total_revenue || 0,
        new Date(merchant.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merchants.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Merchants data has been exported to CSV",
    });
  };

  if (!isAuthReady || loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please log in to access merchant data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userRole?.name !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">Admin privileges required to view merchant data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Merchants</h3>
            <p className="mb-4">{error}</p>
            <Button onClick={fetchMerchants}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Merchants Management</CardTitle>
              <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Merchant
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Debug Info */}
            <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
              <strong>Debug Info:</strong><br />
              Total merchants: {merchants.length}<br />
              Filtered merchants: {filteredMerchants.length}<br />
              Auth ready: {isAuthReady ? 'Yes' : 'No'}<br />
              User role: {userRole?.name || 'None'}<br />
              Error: {error || 'None'}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by business name, owner, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportMerchants} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Merchants Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Business Phone</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Study Halls</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMerchants.map((merchant) => (
                    <TableRow key={merchant.id}>
                      <TableCell className="font-medium">{merchant.business_name}</TableCell>
                      <TableCell>{merchant.full_name}</TableCell>
                      <TableCell>{merchant.business_phone}</TableCell>
                      <TableCell>{merchant.contact_number}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(merchant.approval_status)}>
                          {merchant.approval_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{merchant.total_study_halls || 0}</TableCell>
                      <TableCell>₹{(merchant.total_revenue || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(merchant.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(merchant)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditMerchant(merchant)}
                            title="Edit Merchant"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteMerchant(merchant)}
                            title="Delete Merchant"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredMerchants.length === 0 && merchants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="mb-4">
                  <strong>No merchants found in database.</strong>
                </div>
                <p>The test data from the migration should be available.</p>
                <Button onClick={fetchMerchants} className="mt-2">
                  Refresh Data
                </Button>
              </div>
            )}

            {filteredMerchants.length === 0 && merchants.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                No merchants found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <MerchantDetailsModal
          merchant={selectedMerchant}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedMerchant(null);
          }}
          onUpdateStatus={handleUpdateStatus}
        />

        <AddMerchantModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateMerchant}
        />

        <EditMerchantModal
          merchant={selectedMerchant}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMerchant(null);
          }}
          onSubmit={handleUpdateMerchant}
        />
      </div>
    </ErrorBoundary>
  );
};

export default MerchantsTable;
