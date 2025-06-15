
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, DollarSign, Users, Star, Edit, QrCode, Calendar, Wifi, Car, Coffee, Power, BookOpen, Shield, Camera } from "lucide-react";

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

interface StudyHallViewProps {
  studyHall: StudyHall;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const StudyHallView: React.FC<StudyHallViewProps> = ({
  studyHall,
  isOpen,
  onClose,
  onEdit
}) => {
  const amenityIcons: { [key: string]: React.ReactNode } = {
    'wifi': <Wifi className="h-4 w-4" />,
    'parking': <Car className="h-4 w-4" />,
    'coffee': <Coffee className="h-4 w-4" />,
    'power': <Power className="h-4 w-4" />,
    'library': <BookOpen className="h-4 w-4" />,
    'security': <Shield className="h-4 w-4" />,
    'cctv': <Camera className="h-4 w-4" />
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'disabled':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  const availableSeats = studyHall.layout.filter(seat => seat.status === 'available').length;
  const occupiedSeats = studyHall.layout.filter(seat => seat.status === 'occupied').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl">{studyHall.name}</DialogTitle>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={getStatusColor(studyHall.status)}>
                  {studyHall.status.toUpperCase()}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{studyHall.rating}</span>
                  <span className="text-sm text-gray-500">({studyHall.totalBookings} bookings)</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="layout">Seat Layout</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Information */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Location</span>
                    </div>
                    <p className="font-medium">{studyHall.location}</p>
                    <p className="text-sm text-gray-500">
                      GPS: {studyHall.gpsLocation.lat.toFixed(4)}, {studyHall.gpsLocation.lng.toFixed(4)}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Capacity</span>
                    </div>
                    <p className="font-medium">{studyHall.capacity} seats</p>
                    <p className="text-sm text-gray-500">{studyHall.rows}×{studyHall.seatsPerRow} layout</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-sm">Description</span>
                    </div>
                    <p className="text-gray-700">{studyHall.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-sm">Merchant</span>
                    </div>
                    <p className="font-medium">{studyHall.merchantName}</p>
                    <p className="text-sm text-gray-500">ID: {studyHall.merchantId}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{availableSeats}</div>
                      <div className="text-sm text-gray-600">Available Seats</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{occupiedSeats}</div>
                      <div className="text-sm text-gray-600">Occupied Seats</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">₹{studyHall.pricePerDay}</div>
                      <div className="text-sm text-gray-600">Per Day</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Pricing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold">₹{studyHall.pricePerDay}</div>
                    <div className="text-sm text-gray-600">Per Day</div>
                  </div>
                  {studyHall.pricePerWeek > 0 && (
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-lg font-bold">₹{studyHall.pricePerWeek}</div>
                      <div className="text-sm text-gray-600">Per Week</div>
                    </div>
                  )}
                  {studyHall.pricePerMonth > 0 && (
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-lg font-bold">₹{studyHall.pricePerMonth}</div>
                      <div className="text-sm text-gray-600">Per Month</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Standard Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {studyHall.amenities.map(amenity => (
                        <Badge key={amenity} variant="secondary" className="flex items-center space-x-1">
                          {amenityIcons[amenity.toLowerCase()]}
                          <span>{amenity}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {studyHall.customAmenities && studyHall.customAmenities.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Additional Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {studyHall.customAmenities.map(amenity => (
                          <Badge key={amenity} variant="outline">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Seat Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="bg-gray-800 text-white py-2 px-4 rounded inline-block">
                      📚 Front Area
                    </div>
                  </div>
                  
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${studyHall.seatsPerRow}, 1fr)` }}>
                    {studyHall.layout.map(seat => (
                      <div
                        key={seat.id}
                        className={`
                          w-10 h-10 rounded-md border-2 border-white 
                          flex items-center justify-center text-xs font-medium text-white
                          ${getSeatColor(seat.status)}
                        `}
                        title={`Seat ${seat.id} - ${seat.status}`}
                      >
                        {seat.id}
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-4">
                    <div className="bg-gray-800 text-white py-2 px-4 rounded inline-block">
                      🚪 Entry/Exit
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="w-6 h-6 bg-green-500 rounded mx-auto mb-1"></div>
                    <div className="text-sm font-medium">Available</div>
                    <div className="text-lg font-bold">{availableSeats}</div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 bg-red-500 rounded mx-auto mb-1"></div>
                    <div className="text-sm font-medium">Occupied</div>
                    <div className="text-lg font-bold">{occupiedSeats}</div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 bg-yellow-500 rounded mx-auto mb-1"></div>
                    <div className="text-sm font-medium">Maintenance</div>
                    <div className="text-lg font-bold">
                      {studyHall.layout.filter(s => s.status === 'maintenance').length}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 bg-gray-500 rounded mx-auto mb-1"></div>
                    <div className="text-sm font-medium">Disabled</div>
                    <div className="text-lg font-bold">
                      {studyHall.layout.filter(s => s.status === 'disabled').length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Study Hall Images</CardTitle>
              </CardHeader>
              <CardContent>
                {studyHall.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {studyHall.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`${studyHall.name} - Image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {image === studyHall.mainImage && (
                          <Badge className="absolute top-2 left-2 bg-blue-500">
                            Main Image
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No images uploaded yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Recent Bookings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Booking history will be displayed here when integrated with the booking system
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Bookings</span>
                      <span className="font-bold">{studyHall.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Rating</span>
                      <span className="font-bold">{studyHall.rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Occupancy Rate</span>
                      <span className="font-bold">{Math.round((occupiedSeats / studyHall.capacity) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue (Estimated)</span>
                      <span className="font-bold">₹{(studyHall.totalBookings * studyHall.pricePerDay).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm">Available</span>
                      </div>
                      <span className="text-sm font-medium">{availableSeats} seats</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-sm">Occupied</span>
                      </div>
                      <span className="text-sm font-medium">{occupiedSeats} seats</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span className="text-sm">Maintenance</span>
                      </div>
                      <span className="text-sm font-medium">
                        {studyHall.layout.filter(s => s.status === 'maintenance').length} seats
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StudyHallView;
