
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, CheckCircle, XCircle, Ban, Building2, Star, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Merchant {
  id: number;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  totalEarnings: number;
  rating: number;
  studyHallsCount: number;
  createdAt: string;
  studyHalls?: StudyHall[];
}

interface StudyHall {
  id: number;
  title: string;
  location: string;
  earnings: number;
  bookings: number;
}

const MerchantsTable = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedMerchant, setExpandedMerchant] = useState<number | null>(null);
  const { toast } = useToast();

  // Mock data for merchants
  const mockMerchants: Merchant[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      businessName: "Kumar Study Centers",
      email: "rajesh@kumarstudy.com",
      phone: "+91 9876543210",
      status: 'approved',
      totalEarnings: 125000,
      rating: 4.5,
      studyHallsCount: 3,
      createdAt: "2024-01-15",
      studyHalls: [
        { id: 1, title: "Main Branch Study Hall", location: "Delhi NCR", earnings: 45000, bookings: 120 },
        { id: 2, title: "Secondary Branch", location: "Gurgaon", earnings: 35000, bookings: 95 },
        { id: 3, title: "New Branch", location: "Noida", earnings: 45000, bookings: 110 }
      ]
    },
    {
      id: 2,
      name: "Priya Sharma",
      businessName: "Sharma Learning Hub",
      email: "priya@sharmalearning.com",
      phone: "+91 9876543211",
      status: 'pending',
      totalEarnings: 0,
      rating: 0,
      studyHallsCount: 1,
      createdAt: "2024-06-10",
      studyHalls: [
        { id: 4, title: "Premium Study Space", location: "Mumbai", earnings: 0, bookings: 0 }
      ]
    },
    {
      id: 3,
      name: "Amit Singh",
      businessName: "Singh Study Solutions",
      email: "amit@singhstudy.com",
      phone: "+91 9876543212",
      status: 'suspended',
      totalEarnings: 78000,
      rating: 3.8,
      studyHallsCount: 2,
      createdAt: "2024-02-20",
      studyHalls: [
        { id: 5, title: "Central Study Hall", location: "Bangalore", earnings: 45000, bookings: 85 },
        { id: 6, title: "Tech Park Branch", location: "Bangalore", earnings: 33000, bookings: 70 }
      ]
    },
    {
      id: 4,
      name: "Sneha Patel",
      businessName: "Patel Education Center",
      email: "sneha@pateledu.com",
      phone: "+91 9876543213",
      status: 'approved',
      totalEarnings: 198000,
      rating: 4.8,
      studyHallsCount: 4,
      createdAt: "2024-01-05",
      studyHalls: [
        { id: 7, title: "Premium Study Lounge", location: "Pune", earnings: 65000, bookings: 150 },
        { id: 8, title: "Budget Study Hall", location: "Pune", earnings: 35000, bookings: 90 },
        { id: 9, title: "Executive Study Space", location: "Pune", earnings: 55000, bookings: 125 },
        { id: 10, title: "Student Study Zone", location: "Pune", earnings: 43000, bookings: 105 }
      ]
    }
  ];

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get('/api/admin/merchants');
      // setMerchants(response.data);
      
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

  const updateMerchantStatus = async (merchantId: number, newStatus: string) => {
    try {
      // TODO: Replace with actual API call
      // await axios.patch(`/api/admin/merchants/${merchantId}/status`, { status: newStatus });
      
      setMerchants(merchants.map(merchant => 
        merchant.id === merchantId 
          ? { ...merchant, status: newStatus as 'pending' | 'approved' | 'rejected' | 'suspended' }
          : merchant
      ));

      toast({
        title: "Success",
        description: `Merchant ${newStatus} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update merchant status",
        variant: "destructive",
      });
    }
  };

  const toggleMerchantDetails = (merchantId: number) => {
    setExpandedMerchant(expandedMerchant === merchantId ? null : merchantId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      case 'suspended': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'pending': return <Eye className="h-3 w-3 mr-1" />;
      case 'rejected': return <XCircle className="h-3 w-3 mr-1" />;
      case 'suspended': return <Ban className="h-3 w-3 mr-1" />;
      default: return null;
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
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, business, or email..."
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
                <SelectItem value="all">All Merchants</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
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
                  <TableHead>Merchant Info</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Study Halls</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map((merchant) => (
                  <React.Fragment key={merchant.id}>
                    <TableRow>
                      <TableCell>
                        <div>
                          <div className="font-medium">{merchant.name}</div>
                          <div className="text-sm text-gray-500">{merchant.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          {merchant.businessName}
                        </div>
                      </TableCell>
                      <TableCell>{merchant.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{merchant.studyHallsCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                          ₹{merchant.totalEarnings.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {merchant.rating > 0 ? (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                            {merchant.rating}
                          </div>
                        ) : (
                          <span className="text-gray-400">No ratings</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(merchant.status)}>
                          {getStatusIcon(merchant.status)}
                          {merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleMerchantDetails(merchant.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {merchant.status === 'pending' && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => updateMerchantStatus(merchant.id, 'approved')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => updateMerchantStatus(merchant.id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {merchant.status === 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateMerchantStatus(merchant.id, 'suspended')}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Suspend
                            </Button>
                          )}
                          {merchant.status === 'suspended' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => updateMerchantStatus(merchant.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Reactivate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded merchant details */}
                    {expandedMerchant === merchant.id && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-gray-50">
                          <div className="p-4 space-y-4">
                            <h4 className="font-semibold text-lg">Study Halls & Performance</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {merchant.studyHalls?.map((hall) => (
                                <Card key={hall.id} className="p-4">
                                  <h5 className="font-medium">{hall.title}</h5>
                                  <p className="text-sm text-gray-600 mb-2">{hall.location}</p>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span>Earnings:</span>
                                      <span className="font-medium">₹{hall.earnings.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Bookings:</span>
                                      <span className="font-medium">{hall.bookings}</span>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantsTable;
