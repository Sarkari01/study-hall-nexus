
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Eye, Edit, Trash2, Plus, Building2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Merchant {
  id: number;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  studyHallsCount: number;
  totalRevenue: number;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  joinedDate: string;
  lastActive: string;
}

const MerchantsTable = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    address: ''
  });
  const { toast } = useToast();

  const mockMerchants: Merchant[] = [
    {
      id: 1,
      name: "Sneha Patel",
      businessName: "Premium Study Lounge",
      email: "sneha@premiumstudy.com",
      phone: "+91 9876543210",
      address: "Connaught Place, New Delhi",
      studyHallsCount: 3,
      totalRevenue: 125000,
      status: 'active',
      joinedDate: "2024-01-15",
      lastActive: "2024-06-14"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      businessName: "Kumar Study Centers",
      email: "rajesh@kumarstudy.com",
      phone: "+91 9876543211",
      address: "Karol Bagh, New Delhi",
      studyHallsCount: 2,
      totalRevenue: 89000,
      status: 'active',
      joinedDate: "2024-02-20",
      lastActive: "2024-06-13"
    },
    {
      id: 3,
      name: "Amit Singh",
      businessName: "Tech Park Study Space",
      email: "amit@techpark.com",
      phone: "+91 9876543212",
      address: "Gurgaon, Haryana",
      studyHallsCount: 1,
      totalRevenue: 45000,
      status: 'pending',
      joinedDate: "2024-03-10",
      lastActive: "2024-06-12"
    },
    {
      id: 4,
      name: "Priya Sharma",
      businessName: "Student Study Zone",
      email: "priya@studyzone.com",
      phone: "+91 9876543213",
      address: "Lajpat Nagar, New Delhi",
      studyHallsCount: 4,
      totalRevenue: 156000,
      status: 'rejected',
      joinedDate: "2024-04-05",
      lastActive: "2024-06-10"
    }
  ];

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setMerchants(mockMerchants);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch merchants data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleAddMerchant = async () => {
    try {
      const newMerchant: Merchant = {
        id: Date.now(),
        ...formData,
        studyHallsCount: 0,
        totalRevenue: 0,
        status: 'pending' as const,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0]
      };

      setMerchants(prev => [...prev, newMerchant]);
      setFormData({ name: '', businessName: '', email: '', phone: '', address: '' });
      setIsAddModalOpen(false);

      toast({
        title: "Success",
        description: "Merchant added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add merchant",
        variant: "destructive",
      });
    }
  };

  const handleEditMerchant = async () => {
    if (!selectedMerchant) return;

    try {
      setMerchants(prev => prev.map(merchant => 
        merchant.id === selectedMerchant.id 
          ? { ...merchant, ...formData }
          : merchant
      ));

      setIsEditModalOpen(false);
      setSelectedMerchant(null);
      setFormData({ name: '', businessName: '', email: '', phone: '', address: '' });

      toast({
        title: "Success",
        description: "Merchant updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update merchant",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMerchant = async (merchantId: number) => {
    if (!confirm("Are you sure you want to delete this merchant?")) return;

    try {
      setMerchants(prev => prev.filter(merchant => merchant.id !== merchantId));
      
      toast({
        title: "Success",
        description: "Merchant deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete merchant",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (merchantId: number, newStatus: string) => {
    try {
      setMerchants(prev => prev.map(merchant => 
        merchant.id === merchantId 
          ? { ...merchant, status: newStatus as Merchant['status'] }
          : merchant
      ));

      toast({
        title: "Success",
        description: `Merchant status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update merchant status",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setFormData({
      name: merchant.name,
      businessName: merchant.businessName,
      email: merchant.email,
      phone: merchant.phone,
      address: merchant.address
    });
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      case 'inactive': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Merchants</p>
                <p className="text-2xl font-bold">{merchants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{merchants.filter(m => m.status === 'active').length}</p>
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
                <p className="text-2xl font-bold">{merchants.filter(m => m.status === 'pending').length}</p>
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
                <p className="text-2xl font-bold">{merchants.filter(m => m.status === 'rejected').length}</p>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Merchant
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Merchant</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter merchant name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="Enter business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMerchant}>
                      Add Merchant
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                  <TableHead>Merchant</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Study Halls</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{merchant.name}</div>
                        <div className="text-sm text-gray-500">{merchant.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{merchant.businessName}</div>
                        <div className="text-sm text-gray-500">{merchant.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>{merchant.phone}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{merchant.studyHallsCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">₹{merchant.totalRevenue.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(merchant.status)}
                        <Select
                          value={merchant.status}
                          onValueChange={(value) => handleStatusChange(merchant.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(merchant)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMerchant(merchant.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Merchant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter merchant name"
              />
            </div>
            <div>
              <Label htmlFor="edit-businessName">Business Name</Label>
              <Input
                id="edit-businessName"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Enter business name"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditMerchant}>
                Update Merchant
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MerchantsTable;
