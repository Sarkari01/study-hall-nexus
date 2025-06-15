
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Edit, MapPin, Building2, DollarSign, Car, Snowflake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyHall {
  id: number;
  title: string;
  merchant: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  pricingModel: 'hourly' | 'daily' | 'monthly';
  basePrice: number;
  totalCabins: number;
  availableCabins: number;
  amenities: string[];
  mainImage?: string;
  createdAt: string;
  cabins?: Cabin[];
}

interface Cabin {
  id: string;
  status: 'available' | 'occupied' | 'maintenance';
  type: 'standard' | 'premium';
}

const StudyHallsTable = () => {
  const [studyHalls, setStudyHalls] = useState<StudyHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedHall, setExpandedHall] = useState<number | null>(null);
  const { toast } = useToast();

  // Mock data for study halls
  const mockStudyHalls: StudyHall[] = [
    {
      id: 1,
      title: "Premium Study Lounge",
      merchant: "Sneha Patel",
      location: "Pune Central, Maharashtra",
      status: 'active',
      pricingModel: 'hourly',
      basePrice: 50,
      totalCabins: 20,
      availableCabins: 15,
      amenities: ['AC', 'Parking', 'Wi-Fi', 'CCTV'],
      createdAt: "2024-01-15",
      cabins: [
        { id: 'A1', status: 'occupied', type: 'premium' },
        { id: 'A2', status: 'available', type: 'premium' },
        { id: 'A3', status: 'available', type: 'standard' },
        { id: 'A4', status: 'maintenance', type: 'standard' },
        { id: 'B1', status: 'available', type: 'premium' },
        { id: 'B2', status: 'occupied', type: 'standard' }
      ]
    },
    {
      id: 2,
      title: "Kumar Study Centers - Main Branch",
      merchant: "Rajesh Kumar",
      location: "Delhi NCR, Delhi",
      status: 'active',
      pricingModel: 'daily',
      basePrice: 200,
      totalCabins: 25,
      availableCabins: 18,
      amenities: ['AC', 'Parking', 'Cafeteria'],
      createdAt: "2024-02-10",
      cabins: [
        { id: 'C1', status: 'occupied', type: 'premium' },
        { id: 'C2', status: 'available', type: 'standard' },
        { id: 'C3', status: 'available', type: 'premium' },
        { id: 'D1', status: 'occupied', type: 'standard' }
      ]
    },
    {
      id: 3,
      title: "Tech Park Study Space",
      merchant: "Amit Singh",
      location: "Bangalore, Karnataka",
      status: 'pending',
      pricingModel: 'monthly',
      basePrice: 3000,
      totalCabins: 15,
      availableCabins: 0,
      amenities: ['AC', 'Wi-Fi'],
      createdAt: "2024-06-01",
      cabins: []
    },
    {
      id: 4,
      title: "Student Study Zone",
      merchant: "Sneha Patel",
      location: "Pune, Maharashtra",
      status: 'inactive',
      pricingModel: 'hourly',
      basePrice: 30,
      totalCabins: 12,
      availableCabins: 0,
      amenities: ['Parking', 'Wi-Fi'],
      createdAt: "2024-03-20",
      cabins: []
    }
  ];

  useEffect(() => {
    fetchStudyHalls();
  }, []);

  const fetchStudyHalls = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get('/api/admin/study-halls');
      // setStudyHalls(response.data);
      
      setTimeout(() => {
        setStudyHalls(mockStudyHalls);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch study halls data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const toggleHallDetails = (hallId: number) => {
    setExpandedHall(expandedHall === hallId ? null : hallId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCabinStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredStudyHalls = studyHalls.filter(hall => {
    const matchesSearch = hall.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hall.status === statusFilter;
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
                  placeholder="Search by title, merchant, or location..."
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
                <SelectItem value="all">All Study Halls</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Study Halls Table */}
      <Card>
        <CardHeader>
          <CardTitle>Study Halls ({filteredStudyHalls.length})</CardTitle>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Cabins</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudyHalls.map((hall) => (
                  <React.Fragment key={hall.id}>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <div className="font-medium">{hall.title}</div>
                            <div className="text-sm text-gray-500">ID: {hall.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{hall.merchant}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {hall.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                          ₹{hall.basePrice}/{hall.pricingModel.substring(0, hall.pricingModel.length - 2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{hall.availableCabins}/{hall.totalCabins} available</div>
                          <div className="text-gray-500">Total: {hall.totalCabins}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {hall.amenities.slice(0, 2).map((amenity) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity === 'AC' && <Snowflake className="h-3 w-3 mr-1" />}
                              {amenity === 'Parking' && <Car className="h-3 w-3 mr-1" />}
                              {amenity}
                            </Badge>
                          ))}
                          {hall.amenities.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{hall.amenities.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(hall.status)}>
                          {hall.status.charAt(0).toUpperCase() + hall.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleHallDetails(hall.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded hall details with cabin layout */}
                    {expandedHall === hall.id && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-gray-50">
                          <div className="p-4 space-y-4">
                            <h4 className="font-semibold text-lg">Cabin Layout & Details</h4>
                            
                            {/* All Amenities */}
                            <div>
                              <h5 className="font-medium mb-2">All Amenities</h5>
                              <div className="flex flex-wrap gap-2">
                                {hall.amenities.map((amenity) => (
                                  <Badge key={amenity} variant="outline">
                                    {amenity === 'AC' && <Snowflake className="h-3 w-3 mr-1" />}
                                    {amenity === 'Parking' && <Car className="h-3 w-3 mr-1" />}
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Cabin Layout */}
                            {hall.cabins && hall.cabins.length > 0 ? (
                              <div>
                                <h5 className="font-medium mb-2">Cabin Layout</h5>
                                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                  {hall.cabins.map((cabin) => (
                                    <div
                                      key={cabin.id}
                                      className={`p-3 rounded border text-center text-sm font-medium ${getCabinStatusColor(cabin.status)}`}
                                    >
                                      <div>{cabin.id}</div>
                                      <div className="text-xs mt-1">{cabin.type}</div>
                                      <div className="text-xs">{cabin.status}</div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Legend */}
                                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
                                    Available
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 bg-red-100 border border-red-200 rounded mr-2"></div>
                                    Occupied
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
                                    Maintenance
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-500 text-center py-8">
                                No cabin layout available
                              </div>
                            )}
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

export default StudyHallsTable;
