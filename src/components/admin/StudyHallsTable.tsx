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
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Edit, Trash2, MapPin, Users, DollarSign, CheckCircle, XCircle, Clock, Eye, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StudyHallForm from './StudyHallForm';
import StudyHallView from './StudyHallView';
import ExportButtons from "@/components/shared/ExportButtons";

interface Merchant {
  id: number;
  name: string;
  businessName: string;
  status: string;
}

interface StudyHall {
  id: number;
  name: string;
  merchantId: number;
  merchantName: string;
  location: string;
  gpsLocation: { lat: number; lng: number };
  capacity: number;
  rows: number;
  seatsPerRow: number;
  layout: Array<{ id: string; status: 'available' | 'occupied' | 'maintenance' | 'disabled' }>;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  amenities: string[];
  customAmenities?: string[];
  status: 'draft' | 'active' | 'inactive';
  rating: number;
  totalBookings: number;
  description: string;
  images: string[];
  mainImage: string;
  qrCode?: string;
}

const StudyHallsTable = () => {
  const [studyHalls, setStudyHalls] = useState<StudyHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStudyHall, setSelectedStudyHall] = useState<StudyHall | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const mockMerchants: Merchant[] = [
    { id: 1, name: "Sneha Patel", businessName: "StudySpace Pro", status: "active" },
    { id: 2, name: "Rajesh Kumar", businessName: "Quiet Zones", status: "active" },
    { id: 3, name: "Amit Singh", businessName: "Tech Study Hub", status: "active" }
  ];

  const mockStudyHalls: StudyHall[] = [
    {
      id: 1,
      name: "Premium Study Room A",
      merchantId: 1,
      merchantName: "Sneha Patel",
      location: "Connaught Place, New Delhi",
      gpsLocation: { lat: 28.6315, lng: 77.2167 },
      capacity: 48,
      rows: 6,
      seatsPerRow: 8,
      layout: Array.from({ length: 48 }, (_, i) => {
        const row = Math.floor(i / 8);
        const seat = (i % 8) + 1;
        return {
          id: `${String.fromCharCode(65 + row)}${seat}`,
          status: Math.random() > 0.7 ? 'occupied' : 'available' as const
        };
      }),
      pricePerDay: 50,
      pricePerWeek: 300,
      pricePerMonth: 1000,
      amenities: ["AC", "Wi-Fi", "Parking"],
      customAmenities: [],
      status: 'active',
      rating: 4.5,
      totalBookings: 156,
      description: "Premium study room with modern amenities and comfortable seating",
      images: [
        "/lovable-uploads/2ba034ed-e0e3-4064-8603-66f1efc45a52.png",
        "/api/placeholder/400/300"
      ],
      mainImage: "/lovable-uploads/2ba034ed-e0e3-4064-8603-66f1efc45a52.png",
      qrCode: `${window.location.origin}/book/1`
    },
    {
      id: 2,
      name: "Quiet Study Hall",
      merchantId: 2,
      merchantName: "Rajesh Kumar",
      location: "Karol Bagh, New Delhi",
      gpsLocation: { lat: 28.6519, lng: 77.1909 },
      capacity: 40,
      rows: 5,
      seatsPerRow: 8,
      layout: Array.from({ length: 40 }, (_, i) => {
        const row = Math.floor(i / 8);
        const seat = (i % 8) + 1;
        return {
          id: `${String.fromCharCode(65 + row)}${seat}`,
          status: Math.random() > 0.8 ? 'occupied' : 'available' as const
        };
      }),
      pricePerDay: 40,
      pricePerWeek: 240,
      pricePerMonth: 800,
      amenities: ["AC", "Water Cooler"],
      customAmenities: [],
      status: 'active',
      rating: 4.2,
      totalBookings: 89,
      description: "Perfect for focused study sessions with minimal distractions",
      images: ["/api/placeholder/400/300"],
      mainImage: "/api/placeholder/400/300",
      qrCode: `${window.location.origin}/book/2`
    }
  ];

  function generateLayout(rows: number, seatsPerRow: number): string[] {
    const layout = [];
    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(65 + i); // A, B, C, etc.
      for (let j = 1; j <= seatsPerRow; j++) {
        layout.push(`${rowLetter}${j}`);
      }
    }
    return layout;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setStudyHalls(mockStudyHalls);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleAddStudyHall = (data: any) => {
    const newStudyHall: StudyHall = {
      ...data,
      id: Date.now(),
      rating: 0,
      totalBookings: 0,
      customAmenities: data.customAmenities || [],
      qrCode: data.qrCode || `${window.location.origin}/book/${Date.now()}`
    };
    setStudyHalls(prev => [...prev, newStudyHall]);
  };

  const handleEditStudyHall = (data: any) => {
    if (!selectedStudyHall) return;
    const updatedStudyHall = {
      ...selectedStudyHall,
      ...data,
      customAmenities: data.customAmenities || []
    };
    setStudyHalls(prev => prev.map(hall => 
      hall.id === selectedStudyHall.id ? updatedStudyHall : hall
    ));
  };

  const handleDeleteStudyHall = async (hallId: number) => {
    if (!confirm("Are you sure you want to delete this study hall?")) return;
    setStudyHalls(prev => prev.filter(hall => hall.id !== hallId));
    toast({
      title: "Success",
      description: "Study hall deleted successfully",
    });
  };

  const handleStatusChange = async (hallId: number, newStatus: string) => {
    setStudyHalls(prev => prev.map(hall => 
      hall.id === hallId 
        ? { ...hall, status: newStatus as StudyHall['status'] }
        : hall
    ));
    toast({
      title: "Success",
      description: `Study hall status updated to ${newStatus}`,
    });
  };

  const openViewModal = (hall: StudyHall) => {
    setSelectedStudyHall(hall);
    setIsViewOpen(true);
  };

  const openEditModal = (hall: StudyHall) => {
    setSelectedStudyHall(hall);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openAddModal = () => {
    setSelectedStudyHall(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  // Convert StudyHall to StudyHallFormData format
  const convertToFormData = (hall: StudyHall) => {
    return {
      ...hall,
      merchantId: hall.merchantId.toString(),
      pricePerDay: hall.pricePerDay.toString(),
      pricePerWeek: hall.pricePerWeek.toString(),
      pricePerMonth: hall.pricePerMonth.toString(),
      customAmenities: hall.customAmenities || []
    };
  };

  const filteredStudyHalls = studyHalls.filter(hall => {
    const matchesSearch = hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hall.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || hall.location.includes(locationFilter);
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const uniqueLocations = Array.from(new Set(studyHalls.map(h => h.location.split(',')[1]?.trim() || h.location)));

  // Prepare data for export
  const exportData = filteredStudyHalls.map(hall => ({
    'Study Hall ID': hall.id,
    'Name': hall.name,
    'Merchant': hall.merchantName,
    'Location': hall.location,
    'GPS Coordinates': `${hall.gpsLocation.lat}, ${hall.gpsLocation.lng}`,
    'Capacity': hall.capacity,
    'Layout': `${hall.rows}×${hall.seatsPerRow}`,
    'Available Seats': hall.layout.filter(s => s.status === 'available').length,
    'Occupied Seats': hall.layout.filter(s => s.status === 'occupied').length,
    'Price Per Day': `₹${hall.pricePerDay}`,
    'Price Per Week': hall.pricePerWeek > 0 ? `₹${hall.pricePerWeek}` : 'Not Available',
    'Price Per Month': hall.pricePerMonth > 0 ? `₹${hall.pricePerMonth}` : 'Not Available',
    'Amenities': hall.amenities.join(', '),
    'Custom Amenities': hall.customAmenities?.join(', ') || 'None',
    'Status': hall.status,
    'Rating': hall.rating,
    'Total Bookings': hall.totalBookings,
    'Description': hall.description
  }));

  const exportColumns = [
    'Study Hall ID', 'Name', 'Merchant', 'Location', 'GPS Coordinates', 'Capacity',
    'Layout', 'Available Seats', 'Occupied Seats', 'Price Per Day', 'Price Per Week',
    'Price Per Month', 'Amenities', 'Custom Amenities', 'Status', 'Rating',
    'Total Bookings', 'Description'
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Study Halls</p>
                <p className="text-2xl font-bold">{studyHalls.length}</p>
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
                <p className="text-2xl font-bold">{studyHalls.filter(h => h.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold">{studyHalls.reduce((sum, h) => sum + h.capacity, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Price/Day</p>
                <p className="text-2xl font-bold">₹{Math.round(studyHalls.reduce((sum, h) => sum + h.pricePerDay, 0) / studyHalls.length)}</p>
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
                  placeholder="Search study halls..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Study Hall
            </Button>
            <ExportButtons
              data={exportData}
              filename="study_halls"
              title="Study Halls Report"
              columns={exportColumns}
            />
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
                  <TableHead>Study Hall</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Layout</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudyHalls.map((hall) => (
                  <TableRow key={hall.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          {hall.mainImage ? (
                            <img src={hall.mainImage} alt={hall.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{hall.name}</div>
                          <div className="text-sm text-gray-500">Rating: {hall.rating} ⭐</div>
                          <div className="text-sm text-gray-500">{hall.totalBookings} bookings</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{hall.merchantName}</div>
                        <div className="text-sm text-gray-500">ID: {hall.merchantId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          <div className="text-sm">{hall.location}</div>
                          <div className="text-xs text-gray-500">
                            GPS: {hall.gpsLocation.lat.toFixed(4)}, {hall.gpsLocation.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">{hall.capacity} seats</div>
                          <div className="text-xs text-gray-500">{hall.rows}×{hall.seatsPerRow} grid</div>
                          <div className="text-xs text-green-600">
                            {hall.layout.filter(s => s.status === 'available').length} available
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">₹{hall.pricePerDay}/day</div>
                        {hall.pricePerWeek > 0 && (
                          <div className="text-xs text-gray-500">₹{hall.pricePerWeek}/week</div>
                        )}
                        {hall.pricePerMonth > 0 && (
                          <div className="text-xs text-gray-500">₹{hall.pricePerMonth}/month</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={hall.status}
                        onValueChange={(value) => handleStatusChange(hall.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openViewModal(hall)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(hall)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteStudyHall(hall.id)}>
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

      {/* Study Hall Form Modal */}
      <StudyHallForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={isEditing ? handleEditStudyHall : handleAddStudyHall}
        editData={isEditing ? convertToFormData(selectedStudyHall!) : null}
        isAdmin={true}
      />

      {/* Study Hall View Modal */}
      {selectedStudyHall && (
        <StudyHallView
          studyHall={selectedStudyHall}
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          onEdit={() => {
            setIsViewOpen(false);
            openEditModal(selectedStudyHall);
          }}
        />
      )}
    </div>
  );
};

export default StudyHallsTable;
