
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useStudyHalls } from "@/hooks/useStudyHalls";
import { supabase } from "@/integrations/supabase/client";
import StudyHallForm from "./StudyHallForm";
import StudyHallStats from "./StudyHallStats";
import StudyHallFilters from "./StudyHallFilters";
import StudyHallTableRow from "./StudyHallTableRow";
import ErrorBoundary from "./ErrorBoundary";

const StudyHallsTable = () => {
  const { studyHalls, loading, updateStudyHall, addStudyHall } = useStudyHalls();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCreateStudyHall = async (formData: any) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
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

      const typedStudyHall = {
        ...data,
        status: data.status as 'draft' | 'active' | 'inactive' | 'maintenance'
      };

      addStudyHall(typedStudyHall);
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
    } finally {
      setIsSubmitting(false);
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
    <ErrorBoundary>
      <div className="space-y-6">
        <StudyHallStats
          totalHalls={statistics.totalHalls}
          activeHalls={statistics.activeHalls}
          totalCapacity={statistics.totalCapacity}
          totalRevenue={statistics.totalRevenue}
        />

        <StudyHallFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onCreateClick={() => setShowCreateForm(true)}
          isSubmitting={isSubmitting}
          exportData={exportData}
          exportColumns={exportColumns}
        />

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
                      <StudyHallTableRow
                        key={hall.id}
                        hall={hall}
                        onToggleStatus={toggleStudyHallStatus}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {showCreateForm && (
          <StudyHallForm
            isOpen={showCreateForm}
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreateStudyHall}
            isAdmin={true}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default StudyHallsTable;
