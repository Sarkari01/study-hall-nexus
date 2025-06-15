
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Plus, Edit, Trash2, Users, Building2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  merchantCount: number;
  studyHallCount: number;
  totalCapacity: number;
  averageRating: number;
  status: 'active' | 'inactive';
  popularityScore: number;
  lastUpdated: string;
}

const LocationsTable = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const { toast } = useToast();

  const mockLocations: Location[] = [
    {
      id: 1,
      name: "Connaught Place",
      address: "Central Delhi, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      coordinates: { lat: 28.6328, lng: 77.2197 },
      merchantCount: 15,
      studyHallCount: 45,
      totalCapacity: 1200,
      averageRating: 4.5,
      status: 'active',
      popularityScore: 95,
      lastUpdated: "2024-06-14"
    },
    {
      id: 2,
      name: "Karol Bagh",
      address: "Karol Bagh, New Delhi",
      city: "New Delhi", 
      state: "Delhi",
      pincode: "110005",
      coordinates: { lat: 28.6519, lng: 77.1947 },
      merchantCount: 12,
      studyHallCount: 38,
      totalCapacity: 950,
      averageRating: 4.3,
      status: 'active',
      popularityScore: 88,
      lastUpdated: "2024-06-13"
    },
    {
      id: 3,
      name: "Rajouri Garden",
      address: "Rajouri Garden, New Delhi",
      city: "New Delhi",
      state: "Delhi", 
      pincode: "110027",
      coordinates: { lat: 28.6462, lng: 77.1206 },
      merchantCount: 8,
      studyHallCount: 25,
      totalCapacity: 650,
      averageRating: 4.1,
      status: 'active',
      popularityScore: 75,
      lastUpdated: "2024-06-12"
    },
    {
      id: 4,
      name: "Lajpat Nagar",
      address: "Lajpat Nagar, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110024",
      coordinates: { lat: 28.5672, lng: 77.2436 },
      merchantCount: 6,
      studyHallCount: 18,
      totalCapacity: 480,
      averageRating: 3.9,
      status: 'inactive',
      popularityScore: 60,
      lastUpdated: "2024-06-10"
    },
    {
      id: 5,
      name: "Gurgaon Sector 14",
      address: "Sector 14, Gurgaon",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122001",
      coordinates: { lat: 28.4595, lng: 77.0266 },
      merchantCount: 10,
      studyHallCount: 32,
      totalCapacity: 850,
      averageRating: 4.4,
      status: 'active',
      popularityScore: 82,
      lastUpdated: "2024-06-14"
    }
  ];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setLocations(mockLocations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch locations",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const toggleLocationStatus = (id: number) => {
    setLocations(prev => prev.map(location => 
      location.id === id 
        ? { ...location, status: location.status === 'active' ? 'inactive' : 'active' }
        : location
    ));
    
    const location = locations.find(l => l.id === id);
    toast({
      title: "Location Updated",
      description: `${location?.name} has been ${location?.status === 'active' ? 'deactivated' : 'activated'}`,
    });
  };

  const deleteLocation = (id: number) => {
    const location = locations.find(l => l.id === id);
    setLocations(prev => prev.filter(l => l.id !== id));
    toast({
      title: "Location Deleted",
      description: `${location?.name} has been removed`,
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  const getPopularityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || location.status === statusFilter;
    const matchesCity = cityFilter === 'all' || location.city === cityFilter;
    return matchesSearch && matchesStatus && matchesCity;
  });

  const uniqueCities = Array.from(new Set(locations.map(l => l.city)));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Locations</p>
                <p className="text-2xl font-bold">{locations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Locations</p>
                <p className="text-2xl font-bold">{locations.filter(l => l.status === 'active').length}</p>
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
                <p className="text-2xl font-bold">{locations.reduce((sum, l) => sum + l.totalCapacity, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {(locations.reduce((sum, l) => sum + l.averageRating, 0) / locations.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Locations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Locations Management ({filteredLocations.length})</CardTitle>
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
                  <TableHead>Location</TableHead>
                  <TableHead>City & State</TableHead>
                  <TableHead>Merchants</TableHead>
                  <TableHead>Study Halls</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Popularity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-gray-500">{location.address}</div>
                        <div className="text-xs text-gray-400">PIN: {location.pincode}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{location.city}</div>
                        <div className="text-sm text-gray-500">{location.state}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1 text-blue-600" />
                        <span className="font-medium">{location.merchantCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-medium">{location.studyHallCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-purple-600" />
                        <span className="font-medium">{location.totalCapacity.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-orange-600" />
                        <span className="font-medium">{location.averageRating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${getPopularityColor(location.popularityScore)}`}>
                        {location.popularityScore}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(location.status)}>
                        {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleLocationStatus(location.id)}
                        >
                          {location.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteLocation(location.id)}
                        >
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
    </div>
  );
};

export default LocationsTable;
