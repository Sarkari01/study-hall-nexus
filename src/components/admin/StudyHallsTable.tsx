
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
import { Search, Plus, Edit, Trash2, MapPin, Users, DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyHall {
  id: number;
  title: string;
  merchantName: string;
  location: string;
  capacity: number;
  pricePerHour: number;
  pricePerDay: number;
  amenities: string[];
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  rating: number;
  totalBookings: number;
  description: string;
}

const StudyHallsTable = () => {
  const [studyHalls, setStudyHalls] = useState<StudyHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudyHall, setSelectedStudyHall] = useState<StudyHall | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    merchantName: '',
    location: '',
    capacity: '',
    pricePerHour: '',
    pricePerDay: '',
    description: '',
    amenities: [] as string[]
  });
  const { toast } = useToast();

  const mockStudyHalls: StudyHall[] = [
    {
      id: 1,
      title: "Premium Study Room A",
      merchantName: "Sneha Patel",
      location: "Connaught Place, New Delhi",
      capacity: 25,
      pricePerHour: 50,
      pricePerDay: 800,
      amenities: ["AC", "WiFi", "Parking", "CCTV"],
      status: 'active',
      rating: 4.5,
      totalBookings: 156,
      description: "Premium study room with modern amenities"
    },
    {
      id: 2,
      title: "Quiet Study Hall",
      merchantName: "Rajesh Kumar",
      location: "Karol Bagh, New Delhi",
      capacity: 40,
      pricePerHour: 40,
      pricePerDay: 600,
      amenities: ["AC", "WiFi", "Library"],
      status: 'active',
      rating: 4.2,
      totalBookings: 89,
      description: "Perfect for focused study sessions"
    },
    {
      id: 3,
      title: "Tech Study Space",
      merchantName: "Amit Singh",
      location: "Gurgaon, Haryana",
      capacity: 30,
      pricePerHour: 60,
      pricePerDay: 900,
      amenities: ["AC", "WiFi", "Projector", "Whiteboard"],
      status: 'pending',
      rating: 4.0,
      totalBookings: 45,
      description: "Modern tech-enabled study space"
    }
  ];

  const availableAmenities = ["AC", "WiFi", "Parking", "CCTV", "Library", "Projector", "Whiteboard", "Cafeteria", "Locker"];

  useEffect(() => {
    fetchStudyHalls();
  }, []);

  const fetchStudyHalls = async () => {
    setLoading(true);
    try {
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

  const handleAddStudyHall = async () => {
    try {
      const newStudyHall: StudyHall = {
        id: Date.now(),
        title: formData.title,
        merchantName: formData.merchantName,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        pricePerHour: parseFloat(formData.pricePerHour),
        pricePerDay: parseFloat(formData.pricePerDay),
        description: formData.description,
        amenities: formData.amenities,
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
      setStudyHalls(prev => prev.map(hall => 
        hall.id === selectedStudyHall.id 
          ? { 
              ...hall, 
              title: formData.title,
              merchantName: formData.merchantName,
              location: formData.location,
              capacity: parseInt(formData.capacity),
              pricePerHour: parseFloat(formData.pricePerHour),
              pricePerDay: parseFloat(formData.pricePerDay),
              description: formData.description,
              amenities: formData.amenities
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
      merchantName: hall.merchantName,
      location: hall.location,
      capacity: hall.capacity.toString(),
      pricePerHour: hall.pricePerHour.toString(),
      pricePerDay: hall.pricePerDay.toString(),
      description: hall.description,
      amenities: hall.amenities
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      merchantName: '',
      location: '',
      capacity: '',
      pricePerHour: '',
      pricePerDay: '',
      description: '',
      amenities: []
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
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
                <p className="text-sm text-gray-600">Avg Price/Hour</p>
                <p className="text-2xl font-bold">₹{Math.round(studyHalls.reduce((sum, h) => sum + h.pricePerHour, 0) / studyHalls.length)}</p>
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
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Study Hall</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter study hall title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="merchantName">Merchant Name</Label>
                      <Input
                        id="merchantName"
                        value={formData.merchantName}
                        onChange={(e) => setFormData(prev => ({ ...prev, merchantName: e.target.value }))}
                        placeholder="Enter merchant name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter full address"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                        placeholder="Capacity"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pricePerHour">Price/Hour (₹)</Label>
                      <Input
                        id="pricePerHour"
                        type="number"
                        value={formData.pricePerHour}
                        onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: e.target.value }))}
                        placeholder="Price per hour"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pricePerDay">Price/Day (₹)</Label>
                      <Input
                        id="pricePerDay"
                        type="number"
                        value={formData.pricePerDay}
                        onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                        placeholder="Price per day"
                      />
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
                  <div>
                    <Label>Amenities</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableAmenities.map(amenity => (
                        <Button
                          key={amenity}
                          type="button"
                          variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleAmenity(amenity)}
                        >
                          {amenity}
                        </Button>
                      ))}
                    </div>
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
                  <TableHead>Capacity</TableHead>
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
                    <TableCell>{hall.merchantName}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-sm">{hall.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{hall.capacity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">₹{hall.pricePerHour}/hr</div>
                        <div className="text-sm text-gray-500">₹{hall.pricePerDay}/day</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {hall.amenities.slice(0, 2).map(amenity => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {hall.amenities.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{hall.amenities.length - 2}
                          </Badge>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Study Hall</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter study hall title"
                />
              </div>
              <div>
                <Label htmlFor="edit-merchantName">Merchant Name</Label>
                <Input
                  id="edit-merchantName"
                  value={formData.merchantName}
                  onChange={(e) => setFormData(prev => ({ ...prev, merchantName: e.target.value }))}
                  placeholder="Enter merchant name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter full address"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="Capacity"
                />
              </div>
              <div>
                <Label htmlFor="edit-pricePerHour">Price/Hour (₹)</Label>
                <Input
                  id="edit-pricePerHour"
                  type="number"
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: e.target.value }))}
                  placeholder="Price per hour"
                />
              </div>
              <div>
                <Label htmlFor="edit-pricePerDay">Price/Day (₹)</Label>
                <Input
                  id="edit-pricePerDay"
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                  placeholder="Price per day"
                />
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
            <div>
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableAmenities.map(amenity => (
                  <Button
                    key={amenity}
                    type="button"
                    variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAmenity(amenity)}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
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
