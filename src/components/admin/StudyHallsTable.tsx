import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Eye, 
  Edit,
  MapPin,
  Users,
  DollarSign,
  Star,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStudyHalls } from "@/hooks/useStudyHalls";
import StudyHallForm from "./StudyHallForm";
import ExportButtons from "@/components/shared/ExportButtons";

const StudyHallsTable = () => {
  const { studyHalls, loading, updateStudyHall, addStudyHall } = useStudyHalls();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const handleCreateStudyHall = async (formData: any) => {
    try {
      const { data, error } = await supabase
        .from('study_halls')
        .insert({
          name: formData.name,
          merchant_id: formData.merchantId,
          location: formData.location,
          description: formData.description,
          capacity: formData.rows * formData.seatsPerRow,
          price_per_day: parseFloat(formData.pricePerDay),
          price_per_week: formData.pricePerWeek ? parseFloat(formData.pricePerWeek) : null,
          price_per_month: formData.pricePerMonth ? parseFloat(formData.pricePerMonth) : null,
          amenities: formData.amenities,
          status: formData.status,
          operating_hours: {
            layout: formData.layout,
            rows: formData.rows,
            seatsPerRow: formData.seatsPerRow,
            gpsLocation: formData.gpsLocation
          }
        })
        .select()
        .single();

      if (error) throw error;

      addStudyHall(data);
      setShowCreateForm(false);
      
      toast({
        title: "Success",
        description: "Study hall created successfully",
      });
    } catch (error) {
      console.error('Error creating study hall:', error);
      toast({
        title: "Error",
        description: "Failed to create study hall",
        variant: "destructive",
      });
    }
  };

  const toggleStudyHallStatus = async (studyHallId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateStudyHall(studyHallId, { status: newStatus as 'draft' | 'active' | 'inactive' | 'maintenance' });
    } catch (error) {
      console.error('Error updating study hall status:', error);
    }
  };

  const filteredStudyHalls = useMemo(() => {
    return studyHalls.filter(hall => {
      const matchesSearch = hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hall.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || hall.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [studyHalls, searchTerm, statusFilter]);

  const statistics = useMemo(() => {
    const totalHalls = studyHalls.length;
    const activeHalls = studyHalls.filter(h => h.status === 'active').length;
    const totalCapacity = studyHalls.reduce((sum, h) => sum + h.capacity, 0);
    const totalRevenue = studyHalls.reduce((sum, h) => sum + (h.total_revenue || 0), 0);

    return { totalHalls, activeHalls, totalCapacity, totalRevenue };
  }, [studyHalls]);

  const exportData = useMemo(() => {
    return filteredStudyHalls.map(hall => ({
      'Name': hall.name,
      'Location': hall.location,
      'Capacity': hall.capacity,
      'Price per Day': `₹${hall.price_per_day}`,
      'Total Revenue': `₹${hall.total_revenue}`,
      'Total Bookings': hall.total_bookings,
      'Rating': hall.rating,
      'Status': hall.status,
      'Featured': hall.is_featured ? 'Yes' : 'No',
      'Created': new Date(hall.created_at).toLocaleDateString()
    }));
  }, [filteredStudyHalls]);

  const exportColumns = [
    'Name', 'Location', 'Capacity', 'Price per Day', 'Total Revenue',
    'Total Bookings', 'Rating', 'Status', 'Featured', 'Created'
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Study Halls</p>
                <p className="text-2xl font-bold">{statistics.totalHalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Halls</p>
                <p className="text-2xl font-bold">{statistics.activeHalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold">{statistics.totalCapacity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{statistics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or location..."
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
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Study Hall
            </Button>

            <ExportButtons
              data={exportData}
              filename="study-halls"
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Price/Day</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudyHalls.map((hall) => (
                    <TableRow key={hall.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{hall.name}</span>
                          {hall.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {hall.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{hall.capacity} seats</Badge>
                      </TableCell>
                      <TableCell className="font-medium">₹{hall.price_per_day}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        ₹{hall.total_revenue?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{hall.total_bookings}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          {hall.rating.toFixed(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={hall.status === 'active' ? 'default' : 'secondary'}
                          className={hall.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {hall.status === 'active' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              {hall.status}
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={hall.status === 'active' ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => toggleStudyHallStatus(hall.id, hall.status)}
                          >
                            {hall.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Study Hall Creation Form */}
      <StudyHallForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateStudyHall}
        isAdmin={true}
      />
    </div>
  );
};

export default StudyHallsTable;
