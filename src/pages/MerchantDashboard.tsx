
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, DollarSign, Calendar, TrendingUp, Building2, MapPin, Star, Eye, Plus } from "lucide-react";
import StudyHallForm from "@/components/admin/StudyHallForm";
import StudyHallView from "@/components/admin/StudyHallView";
import { useToast } from "@/hooks/use-toast";

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStudyHall, setSelectedStudyHall] = useState<any>(null);
  const [studyHalls, setStudyHalls] = useState([
    {
      id: 1,
      name: "Premium Study Room A",
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
      status: 'active',
      rating: 4.5,
      totalBookings: 156,
      description: "Premium study room with modern amenities",
      images: ["/lovable-uploads/2ba034ed-e0e3-4064-8603-66f1efc45a52.png"],
      mainImage: "/lovable-uploads/2ba034ed-e0e3-4064-8603-66f1efc45a52.png",
      qrCode: `${window.location.origin}/book/1`,
      merchantId: 1,
      merchantName: "Sneha Patel"
    }
  ]);

  const { toast } = useToast();

  const currentMerchant = {
    id: 1,
    name: "Sneha Patel",
    businessName: "StudySpace Pro",
    email: "sneha@studyspace.com",
    phone: "+91 98765 43210",
    location: "New Delhi"
  };

  const stats = [
    {
      title: "Total Study Halls",
      value: studyHalls.length.toString(),
      change: "+2 this month",
      icon: <Building2 className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Total Bookings",
      value: studyHalls.reduce((sum, hall) => sum + hall.totalBookings, 0).toString(),
      change: "+12% from last month",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: "₹45,680",
      change: "+8.5% from last month",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      title: "Average Rating",
      value: (studyHalls.reduce((sum, hall) => sum + hall.rating, 0) / studyHalls.length).toFixed(1),
      change: "+0.2 from last month",
      icon: <Star className="h-5 w-5" />,
      color: "text-yellow-600"
    }
  ];

  const handleAddStudyHall = (data: any) => {
    const newStudyHall = {
      ...data,
      id: Date.now(),
      merchantId: currentMerchant.id,
      merchantName: currentMerchant.name,
      rating: 0,
      totalBookings: 0,
      qrCode: data.qrCode || `${window.location.origin}/book/${Date.now()}`
    };
    setStudyHalls(prev => [...prev, newStudyHall]);
    toast({
      title: "Success",
      description: "Study hall created successfully",
    });
  };

  const handleEditStudyHall = (data: any) => {
    if (!selectedStudyHall) return;
    setStudyHalls(prev => prev.map(hall => 
      hall.id === selectedStudyHall.id ? { ...hall, ...data } : hall
    ));
    toast({
      title: "Success",
      description: "Study hall updated successfully",
    });
  };

  const openViewModal = (hall: any) => {
    setSelectedStudyHall(hall);
    setIsViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>
              <p className="text-gray-600">Welcome back, {currentMerchant.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {currentMerchant.businessName}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="study-halls">Study Halls</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setIsFormOpen(true)}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    Add Study Hall
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Calendar className="h-6 w-6 mb-2" />
                    View Bookings
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Analytics
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <DollarSign className="h-6 w-6 mb-2" />
                    Revenue Reports
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Study Halls */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Study Halls</CardTitle>
                  <Button onClick={() => setActiveTab("study-halls")} variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studyHalls.slice(0, 3).map((hall) => (
                    <Card key={hall.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {hall.mainImage && (
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={hall.mainImage}
                                alt={hall.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-lg">{hall.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4" />
                              <span>{hall.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span>{hall.capacity} seats</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span>{hall.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">₹{hall.pricePerDay}/day</span>
                            <Button size="sm" variant="outline" onClick={() => openViewModal(hall)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {studyHalls.length === 0 && (
                    <Card className="col-span-full">
                      <CardContent className="p-8 text-center">
                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Study Halls Yet</h3>
                        <p className="text-gray-600 mb-4">Create your first study hall to start accepting bookings</p>
                        <Button onClick={() => setIsFormOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Study Hall
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="study-halls" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Study Halls Management</h2>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Study Hall
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyHalls.map((hall) => (
                <Card key={hall.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {hall.mainImage && (
                      <div className="aspect-video bg-gray-100 overflow-hidden rounded-t-lg">
                        <img
                          src={hall.mainImage}
                          alt={hall.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{hall.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{hall.location}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={hall.status === 'active' ? 'default' : 'secondary'}
                          className={hall.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {hall.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{hall.capacity} seats</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{hall.totalBookings} bookings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{hall.rating} rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>₹{hall.pricePerDay}/day</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {hall.amenities.slice(0, 3).map(amenity => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {hall.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{hall.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openViewModal(hall)} className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">Booking management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Merchant Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Business Name</label>
                    <p className="text-lg">{currentMerchant.businessName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Owner Name</label>
                    <p className="text-lg">{currentMerchant.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg">{currentMerchant.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-lg">{currentMerchant.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="text-lg">{currentMerchant.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Study Hall Form Modal */}
        <StudyHallForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddStudyHall}
          editData={null}
          isAdmin={false}
          currentMerchant={currentMerchant}
        />

        {/* Study Hall View Modal */}
        {selectedStudyHall && (
          <StudyHallView
            studyHall={selectedStudyHall}
            isOpen={isViewOpen}
            onClose={() => setIsViewOpen(false)}
            onEdit={() => {
              setIsViewOpen(false);
              // Open edit modal functionality can be added here
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;
