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
import { Search, Plus, Edit, Trash2, MapPin, Users, DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyHall {
  id: number;
  title: string;
  merchantId: number;
  merchantName: string;
  location: string;
  gpsLocation: {
    lat: number;
    lng: number;
  };
  capacity: number;
  rows: number;
  seatsPerRow: number;
  layout: string[];
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  amenities: string[];
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  rating: number;
  totalBookings: number;
  description: string;
}

interface Merchant {
  id: number;
  name: string;
  businessName: string;
  status: string;
}

const StudyHallsTable = () => {
  const [studyHalls, setStudyHalls] = useState<StudyHall[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudyHall, setSelectedStudyHall] = useState<StudyHall | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    merchantId: '',
    location: '',
    gpsLocation: { lat: 0, lng: 0 },
    rows: '',
    seatsPerRow: '',
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    description: '',
    amenities: {
      ac: false,
      parking: false
    }
  });
  const { toast } = useToast();

  const mockMerchants: Merchant[] = [
    { id: 1, name: "Sneha Patel", businessName: "StudySpace Pro", status: "active" },
    { id: 2, name: "Rajesh Kumar", businessName: "Quiet Zones", status: "active" },
    { id: 3, name: "Amit Singh", businessName: "Tech Study Hub", status: "active" }
  ];

  const mockStudyHalls: StudyHall[] = [
    {
      id: 1,
      title: "Premium Study Room A",
      merchantId: 1,
      merchantName: "Sneha Patel",
      location: "Connaught Place, New Delhi",
      gpsLocation: { lat: 28.6315, lng: 77.2167 },
      capacity: 25,
      rows: 5,
      seatsPerRow: 5,
      layout: generateLayout(5, 5),
      pricePerDay: 50,
      pricePerWeek: 300,
      pricePerMonth: 1000,
      amenities: ["AC", "Parking"],
      status: 'active',
      rating: 4.5,
      totalBookings: 156,
      description: "Premium study room with modern amenities"
    },
    {
      id: 2,
      title: "Quiet Study Hall",
      merchantId: 2,
      merchantName: "Rajesh Kumar",
      location: "Karol Bagh, New Delhi",
      gpsLocation: { lat: 28.6519, lng: 77.1909 },
      capacity: 40,
      rows: 8,
      seatsPerRow: 5,
      layout: generateLayout(8, 5),
      pricePerDay: 40,
      pricePerWeek: 240,
      pricePerMonth: 800,
      amenities: ["AC"],
      status: 'active',
      rating: 4.2,
      totalBookings: 89,
      description: "Perfect for focused study sessions"
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
        setMerchants(mockMerchants);
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

  const handleAddStudyHall = async () => {
    try {
      const rows = parseInt(formData.rows);
      const seatsPerRow = parseInt(formData.seatsPerRow);
      const selectedMerchant = merchants.find(m => m.id === parseInt(formData.merchantId));
      
      if (!selectedMerchant) {
        toast({
          title: "Error",
          description: "Please select a merchant",
          variant: "destructive",
        });
        return;
      }

      const newStudyHall: StudyHall = {
        id: Date.now(),
        title: formData.title,
        merchantId: parseInt(formData.merchantId),
        merchantName: selectedMerchant.name,
        location: formData.location,
        gpsLocation: formData.gpsLocation,
        capacity: rows * seatsPerRow,
        rows: rows,
        seatsPerRow: seatsPerRow,
        layout: generateLayout(rows, seatsPerRow),
        pricePerDay: parseFloat(formData.pricePerDay),
        pricePerWeek: parseFloat(formData.pricePerWeek),
        pricePerMonth: parseFloat(formData.pricePerMonth),
        description: formData.description,
        amenities: Object.entries(formData.amenities)
          .filter(([_, value]) => value)
          .map(([key, _]) => key === 'ac' ? 'AC' : 'Parking'),
        status: 'pending',
        rating: 0,
        totalBookings: 0
      };

      setStudyHalls(prev => [...prev, newStudyHall]);
      resetForm();
      setIsAddModalOpen(false);

      toast({
        title: "Success",
        description: "Study hall added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add study hall",
        variant: "destructive",
      });
    }
  };

  const handleEditStudyHall = async () => {
    if (!selectedStudyHall) return;

    try {
      const rows = parseInt(formData.rows);
      const seatsPerRow = parseInt(formData.seatsPerRow);
      const selectedMerchant = merchants.find(m => m.id === parseInt(formData.merchantId));

      setStudyHalls(prev => prev.map(hall => 
        hall.id === selectedStudyHall.id 
          ? { 
              ...hall, 
              title: formData.title,
              merchantId: parseInt(formData.merchantId),
              merchantName: selectedMerchant?.name || hall.merchantName,
              location: formData.location,
              gpsLocation: formData.gpsLocation,
              capacity: rows * seatsPerRow,
              rows: rows,
              seatsPerRow: seatsPerRow,
              layout: generateLayout(rows, seatsPerRow),
              pricePerDay: parseFloat(formData.pricePerDay),
              pricePerWeek: parseFloat(formData.pricePerWeek),
              pricePerMonth: parseFloat(formData.pricePerMonth),
              description: formData.description,
              amenities: Object.entries(formData.amenities)
                .filter(([_, value]) => value)
                .map(([key, _]) => key === 'ac' ? 'AC' : 'Parking')
            }
          : hall
      ));

      setIsEditModalOpen(false);
      setSelectedStudyHall(null);
      resetForm();

      toast({
        title: "Success",
        description: "Study hall updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update study hall",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudyHall = async (hallId: number) => {
    if (!confirm("Are you sure you want to delete this study hall?")) return;

    try {
      setStudyHalls(prev => prev.filter(hall => hall.id !== hallId));
      
      toast({
        title: "Success",
        description: "Study hall deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete study hall",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (hallId: number, newStatus: string) => {
    try {
      setStudyHalls(prev => prev.map(hall => 
        hall.id === hallId 
          ? { ...hall, status: newStatus as StudyHall['status'] }
          : hall
      ));

      toast({
        title: "Success",
        description: `Study hall status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (hall: StudyHall) => {
    setSelectedStudyHall(hall);
    setFormData({
      title: hall.title,
      merchantId: hall.merchantId.toString(),
      location: hall.location,
      gpsLocation: hall.gpsLocation,
      rows: hall.rows.toString(),
      seatsPerRow: hall.seatsPerRow.toString(),
      pricePerDay: hall.pricePerDay.toString(),
      pricePerWeek: hall.pricePerWeek.toString(),
      pricePerMonth: hall.pricePerMonth.toString(),
      description: hall.description,
      amenities: {
        ac: hall.amenities.includes('AC'),
        parking: hall.amenities.includes('Parking')
      }
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      merchantId: '',
      location: '',
      gpsLocation: { lat: 0, lng: 0 },
      rows: '',
      seatsPerRow: '',
      pricePerDay: '',
      pricePerWeek: '',
      pricePerMonth: '',
      description: '',
      amenities: {
        ac: false,
        parking: false
      }
    });
  };

  const handleLocationSelect = (location: string, coordinates: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      location,
      gpsLocation: coordinates
    }));
  };

  const filteredStudyHalls = studyHalls.filter(hall => {
    const matchesSearch = hall.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hall.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hall.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || hall.location.includes(locationFilter);
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const uniqueLocations = Array.from(new Set(studyHalls.map(h => h.location.split(',')[1]?.trim() || h.location)));

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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Study Hall
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Study Hall</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Study Hall Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter study hall title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="merchant">Select Merchant</Label>
                      <Select value={formData.merchantId} onValueChange={(value) => setFormData(prev => ({ ...prev, merchantId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose merchant" />
                        </SelectTrigger>
                        <SelectContent>
                          {merchants.filter(m => m.status === 'active').map(merchant => (
                            <SelectItem key={merchant.id} value={merchant.id.toString()}>
                              {merchant.name} - {merchant.businessName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location with GPS</Label>
                    <div className="space-y-2">
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter address (e.g., Connaught Place, New Delhi)"
                      />
                      <div className="text-xs text-gray-500">
                        GPS: Lat {formData.gpsLocation.lat.toFixed(6)}, Lng {formData.gpsLocation.lng.toFixed(6)}
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Simulate GPS location capture
                          const lat = 28.6315 + (Math.random() - 0.5) * 0.1;
                          const lng = 77.2167 + (Math.random() - 0.5) * 0.1;
                          handleLocationSelect(formData.location, { lat, lng });
                        }}
                      >
                        📍 Capture GPS Location
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Cabin Layout (Movie Theater Style)</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="rows">Number of Rows</Label>
                        <Input
                          id="rows"
                          type="number"
                          value={formData.rows}
                          onChange={(e) => setFormData(prev => ({ ...prev, rows: e.target.value }))}
                          placeholder="6"
                          min="1" max="10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seatsPerRow">Seats per Row</Label>
                        <Input
                          id="seatsPerRow"
                          type="number"
                          value={formData.seatsPerRow}
                          onChange={(e) => setFormData(prev => ({ ...prev, seatsPerRow: e.target.value }))}
                          placeholder="5"
                          min="1" max="10"
                        />
                      </div>
                    </div>
                    {formData.rows && formData.seatsPerRow && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">
                          Layout Preview: {generateLayout(parseInt(formData.rows), parseInt(formData.seatsPerRow)).slice(0, 6).join(', ')}
                          {parseInt(formData.rows) * parseInt(formData.seatsPerRow) > 6 && '...'}
                        </p>
                        <p className="text-sm font-medium">Total Capacity: {parseInt(formData.rows || '0') * parseInt(formData.seatsPerRow || '0')} seats</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Flexible Pricing</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label htmlFor="pricePerDay">📅 Per Day (₹)</Label>
                        <Input
                          id="pricePerDay"
                          type="number"
                          value={formData.pricePerDay}
                          onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                          placeholder="50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricePerWeek">📆 Per Week (₹)</Label>
                        <Input
                          id="pricePerWeek"
                          type="number"
                          value={formData.pricePerWeek}
                          onChange={(e) => setFormData(prev => ({ ...prev, pricePerWeek: e.target.value }))}
                          placeholder="300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricePerMonth">🗓️ Per Month (₹)</Label>
                        <Input
                          id="pricePerMonth"
                          type="number"
                          value={formData.pricePerMonth}
                          onChange={(e) => setFormData(prev => ({ ...prev, pricePerMonth: e.target.value }))}
                          placeholder="1000"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Amenities</Label>
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="ac" 
                          checked={formData.amenities.ac}
                          onCheckedChange={(checked) => setFormData(prev => ({
                            ...prev,
                            amenities: { ...prev.amenities, ac: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="ac" className="flex items-center gap-2">
                          ❄️ Air Conditioning (AC)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="parking" 
                          checked={formData.amenities.parking}
                          onCheckedChange={(checked) => setFormData(prev => ({
                            ...prev,
                            amenities: { ...prev.amenities, parking: checked as boolean }
                          }))}
                        />
                        <Label htmlFor="parking" className="flex items-center gap-2">
                          🚗 Parking Available
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddStudyHall}>
                      Add Study Hall
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                  <TableHead>Amenities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudyHalls.map((hall) => (
                  <TableRow key={hall.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{hall.title}</div>
                        <div className="text-sm text-gray-500">Rating: {hall.rating} ⭐</div>
                        <div className="text-sm text-gray-500">{hall.totalBookings} bookings</div>
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
                          <div className="text-xs text-gray-500">{hall.rows}x{hall.seatsPerRow} grid</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">₹{hall.pricePerDay}/day</div>
                        <div className="text-xs text-gray-500">₹{hall.pricePerWeek}/week</div>
                        <div className="text-xs text-gray-500">₹{hall.pricePerMonth}/month</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {hall.amenities.map(amenity => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity === 'AC' ? '❄️' : '🚗'} {amenity}
                          </Badge>
                        ))}
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
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Study Hall</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Study Hall Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter study hall title"
                />
              </div>
              <div>
                <Label htmlFor="edit-merchant">Select Merchant</Label>
                <Select value={formData.merchantId} onValueChange={(value) => setFormData(prev => ({ ...prev, merchantId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose merchant" />
                  </SelectTrigger>
                  <SelectContent>
                    {merchants.filter(m => m.status === 'active').map(merchant => (
                      <SelectItem key={merchant.id} value={merchant.id.toString()}>
                        {merchant.name} - {merchant.businessName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-location">Location with GPS</Label>
              <div className="space-y-2">
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter address (e.g., Connaught Place, New Delhi)"
                />
                <div className="text-xs text-gray-500">
                  GPS: Lat {formData.gpsLocation.lat.toFixed(6)}, Lng {formData.gpsLocation.lng.toFixed(6)}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Simulate GPS location capture
                    const lat = 28.6315 + (Math.random() - 0.5) * 0.1;
                    const lng = 77.2167 + (Math.random() - 0.5) * 0.1;
                    handleLocationSelect(formData.location, { lat, lng });
                  }}
                >
                  📍 Capture GPS Location
                </Button>
              </div>
            </div>

            <div>
              <Label>Cabin Layout (Movie Theater Style)</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="edit-rows">Number of Rows</Label>
                  <Input
                    id="edit-rows"
                    type="number"
                    value={formData.rows}
                    onChange={(e) => setFormData(prev => ({ ...prev, rows: e.target.value }))}
                    placeholder="6"
                    min="1" max="10"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-seatsPerRow">Seats per Row</Label>
                  <Input
                    id="edit-seatsPerRow"
                    type="number"
                    value={formData.seatsPerRow}
                    onChange={(e) => setFormData(prev => ({ ...prev, seatsPerRow: e.target.value }))}
                    placeholder="5"
                    min="1" max="10"
                  />
                </div>
              </div>
              {formData.rows && formData.seatsPerRow && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    Layout Preview: {generateLayout(parseInt(formData.rows), parseInt(formData.seatsPerRow)).slice(0, 6).join(', ')}
                    {parseInt(formData.rows) * parseInt(formData.seatsPerRow) > 6 && '...'}
                  </p>
                  <p className="text-sm font-medium">Total Capacity: {parseInt(formData.rows || '0') * parseInt(formData.seatsPerRow || '0')} seats</p>
                </div>
              )}
            </div>

            <div>
              <Label>Flexible Pricing</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="edit-pricePerDay">📅 Per Day (₹)</Label>
                  <Input
                    id="edit-pricePerDay"
                    type="number"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pricePerWeek">📆 Per Week (₹)</Label>
                  <Input
                    id="edit-pricePerWeek"
                    type="number"
                    value={formData.pricePerWeek}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerWeek: e.target.value }))}
                    placeholder="300"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pricePerMonth">🗓️ Per Month (₹)</Label>
                  <Input
                    id="edit-pricePerMonth"
                    type="number"
                    value={formData.pricePerMonth}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerMonth: e.target.value }))}
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Amenities</Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-ac" 
                    checked={formData.amenities.ac}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      amenities: { ...prev.amenities, ac: checked as boolean }
                    }))}
                  />
                  <Label htmlFor="edit-ac" className="flex items-center gap-2">
                    ❄️ Air Conditioning (AC)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-parking" 
                    checked={formData.amenities.parking}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      amenities: { ...prev.amenities, parking: checked as boolean }
                    }))}
                  />
                  <Label htmlFor="edit-parking" className="flex items-center gap-2">
                    🚗 Parking Available
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditStudyHall}>
                Update Study Hall
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudyHallsTable;
