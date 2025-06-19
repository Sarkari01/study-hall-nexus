
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Eye, Edit, Trash2, Download, AlertTriangle, CheckCircle2, XCircle, Filter } from "lucide-react";
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
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('MerchantsTable: Component mounted/updated');
    console.log('MerchantsTable: isAuthReady:', isAuthReady);
    console.log('MerchantsTable: user:', user);
    console.log('MerchantsTable: userRole:', userRole);
    console.log('MerchantsTable: merchants:', merchants);
    console.log('MerchantsTable: merchants.length:', merchants?.length);
    console.log('MerchantsTable: loading:', loading);
    console.log('MerchantsTable: error:', error);
  }, [isAuthReady, user, userRole, merchants, loading, error]);

  // Trigger fetch when auth is ready and user is admin
  useEffect(() => {
    if (isAuthReady && user && userRole?.name === 'admin') {
      console.log('MerchantsTable: Triggering fetchMerchants');
      fetchMerchants();
    }
  }, [isAuthReady, user, userRole, fetchMerchants]);

  // Filter merchants with better error handling
  const filteredMerchants = React.useMemo(() => {
    if (!Array.isArray(merchants)) {
      console.log('MerchantsTable: merchants is not an array:', merchants);
      return [];
    }

    const filtered = merchants.filter(merchant => {
      if (!merchant) return false;
      
      // Search filter
      const searchMatch = searchTerm === '' || 
        (merchant.business_name && merchant.business_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (merchant.full_name && merchant.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (merchant.business_phone && merchant.business_phone.includes(searchTerm)) ||
        (merchant.email && merchant.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const statusMatch = statusFilter === 'all' || merchant.approval_status === statusFilter;
      
      // Verification filter
      const verificationMatch = verificationFilter === 'all' || merchant.verification_status === verificationFilter;
      
      return searchMatch && statusMatch && verificationMatch;
    });

    console.log('MerchantsTable: filteredMerchants:', filtered);
    console.log('MerchantsTable: filteredMerchants.length:', filtered.length);
    return filtered;
  }, [merchants, searchTerm, statusFilter, verificationFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSelectMerchant = (merchantId: string, checked: boolean) => {
    if (checked) {
      setSelectedMerchants(prev => [...prev, merchantId]);
    } else {
      setSelectedMerchants(prev => prev.filter(id => id !== merchantId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMerchants(filteredMerchants.map(m => m.id));
    } else {
      setSelectedMerchants([]);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedMerchants.length === 0) return;
    
    try {
      const promises = selectedMerchants.map(id => 
        updateMerchant(id, { approval_status: 'approved' })
      );
      await Promise.all(promises);
      
      toast({
        title: "Bulk Approval Successful",
        description: `${selectedMerchants.length} merchants have been approved.`,
      });
      
      setSelectedMerchants([]);
    } catch (error) {
      console.error('Error in bulk approval:', error);
      toast({
        title: "Error",
        description: "Failed to approve some merchants. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkReject = async () => {
    if (selectedMerchants.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to reject ${selectedMerchants.length} merchants? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const promises = selectedMerchants.map(id => 
        updateMerchant(id, { approval_status: 'rejected' })
      );
      await Promise.all(promises);
      
      toast({
        title: "Bulk Rejection Successful",
        description: `${selectedMerchants.length} merchants have been rejected.`,
      });
      
      setSelectedMerchants([]);
    } catch (error) {
      console.error('Error in bulk rejection:', error);
      toast({
        title: "Error",
        description: "Failed to reject some merchants. Please try again.",
        variant: "destructive",
      });
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
        toast({
          title: "Merchant Deleted",
          description: `${merchant.business_name} has been deleted successfully.`,
        });
      } catch (error) {
        console.error('Error deleting merchant:', error);
        toast({
          title: "Error",
          description: "Failed to delete merchant. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateStatus = async (merchantId: string, status: 'approved' | 'rejected') => {
    try {
      await updateMerchant(merchantId, { approval_status: status });
      setIsDetailsModalOpen(false);
      setSelectedMerchant(null);
      toast({
        title: "Status Updated",
        description: `Merchant status has been updated to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating merchant status:', error);
      toast({
        title: "Error",
        description: "Failed to update merchant status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateMerchant = async (merchantData: any) => {
    try {
      await createMerchant(merchantData);
      toast({
        title: "Merchant Created",
        description: "New merchant has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating merchant:', error);
      toast({
        title: "Error",
        description: "Failed to create merchant. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMerchant = async (merchantId: string, updates: any) => {
    try {
      await updateMerchant(merchantId, updates);
      toast({
        title: "Merchant Updated",
        description: "Merchant has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating merchant:', error);
      toast({
        title: "Error",
        description: "Failed to update merchant. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportMerchants = () => {
    const csvContent = [
      ['Business Name', 'Owner', 'Business Phone', 'Contact', 'Email', 'Approval Status', 'Verification Status', 'Study Halls', 'Revenue', 'Joined'],
      ...filteredMerchants.map(merchant => [
        merchant.business_name || '',
        merchant.full_name || '',
        merchant.business_phone || '',
        merchant.contact_number || '',
        merchant.email || '',
        merchant.approval_status || '',
        merchant.verification_status || '',
        merchant.total_study_halls || 0,
        merchant.total_revenue || 0,
        merchant.created_at ? new Date(merchant.created_at).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merchants_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Merchants data has been exported to CSV",
    });
  };

  // Show loading state only when actually loading and no data
  if (loading && (!merchants || merchants.length === 0)) {
    return (
      <Card className="border-emerald-200 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-emerald-100 rounded w-1/4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-emerald-50 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check authentication
  if (!isAuthReady) {
    return (
      <Card className="border-emerald-200 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border-emerald-200 shadow-lg">
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
      <Card className="border-emerald-200 shadow-lg">
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
      <Card className="border-emerald-200 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Merchants</h3>
            <p className="mb-4">{error}</p>
            <Button onClick={fetchMerchants} className="bg-emerald-600 hover:bg-emerald-700">
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
        <Card className="border-emerald-200 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-emerald-900 flex items-center gap-2">
                  Merchants Management
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                    {filteredMerchants.length} Total
                  </Badge>
                </CardTitle>
                <p className="text-emerald-600 text-sm mt-1">Manage merchant applications and profiles</p>
              </div>
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className="bg-emerald-600 hover:bg-emerald-700 shadow-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Merchant
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Enhanced Filters */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-4 w-4" />
                  <Input
                    placeholder="Search by business name, owner, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button 
                  variant="outline" 
                  onClick={exportMerchants} 
                  className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              {showAdvancedFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Approval Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Approval Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Verification Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Verification Status</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setVerificationFilter('all');
                    }}
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Bulk Actions */}
              {selectedMerchants.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-blue-800 font-medium">
                    {selectedMerchants.length} merchants selected
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleBulkApprove}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Bulk Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={handleBulkReject}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Bulk Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Merchants Table */}
            {filteredMerchants.length > 0 ? (
              <div className="border rounded-lg overflow-hidden border-emerald-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-emerald-50/50">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedMerchants.length === filteredMerchants.length && filteredMerchants.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-emerald-900 font-semibold">Business Name</TableHead>
                      <TableHead className="text-emerald-900 font-semibold">Owner</TableHead>
                      <TableHead className="text-emerald-900 font-semibold">Business Phone</TableHead>
                      <TableHead className="text-emerald-900 font-semibold">Email</TableHead>
                      <TableHead className="text-emerald-900 font-semibold">Approval</TableHead>
                      <TableHead className="text-emerald-900 font-semibold">Verification</TableHead>
                      <TableHead className="text-emerald-900 font-semibold">Study Halls</TableHead>
                      <TableHead className="text-emerald-900 font-semibold">Revenue</TableHead>
                      <TableHead className="text-emerald-900 font-semibold">Joined</TableHead>
                      <TableHead className="text-emerald-900 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMerchants.map((merchant) => (
                      <TableRow key={merchant.id} className="hover:bg-emerald-50/30">
                        <TableCell>
                          <Checkbox
                            checked={selectedMerchants.includes(merchant.id)}
                            onCheckedChange={(checked) => handleSelectMerchant(merchant.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">{merchant.business_name || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{merchant.full_name || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{merchant.business_phone || 'N/A'}</TableCell>
                        <TableCell className="text-gray-700">{merchant.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(merchant.approval_status || 'pending')}>
                            {merchant.approval_status || 'pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(merchant.verification_status || 'unverified')}>
                            {merchant.verification_status || 'unverified'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700">{merchant.total_study_halls || 0}</TableCell>
                        <TableCell className="text-gray-700">₹{(merchant.total_revenue || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-gray-700">
                          {merchant.created_at ? new Date(merchant.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(merchant)}
                              title="View Details"
                              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditMerchant(merchant)}
                              title="Edit Merchant"
                              className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-200 text-red-600 hover:bg-red-50"
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
            ) : (
              <div className="text-center py-12 bg-emerald-50/30 rounded-lg border border-emerald-100">
                {merchants && merchants.length > 0 ? (
                  <div>
                    <div className="mb-4">
                      <strong className="text-emerald-900">No merchants found matching your criteria.</strong>
                    </div>
                    <p className="text-emerald-700 mb-4">Try adjusting your search or filter settings.</p>
                    <Button 
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setVerificationFilter('all');
                      }} 
                      className="mt-2 bg-emerald-600 hover:bg-emerald-700"
                      variant="default"
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <strong className="text-emerald-900">No merchants found in database.</strong>
                    </div>
                    <p className="text-emerald-700 mb-4">Click "Add Merchant" to create the first merchant.</p>
                    <Button 
                      onClick={fetchMerchants} 
                      className="mt-2 bg-emerald-600 hover:bg-emerald-700" 
                      variant="default"
                    >
                      Refresh Data
                    </Button>
                  </div>
                )}
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
