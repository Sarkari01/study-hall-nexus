
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Calendar, Users, DollarSign, QrCode, Edit, Copy, Download, ExternalLink, Star, Clock, Wifi, Car, Coffee, Zap, Droplets, Bath } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCodeDisplay from './QRCodeDisplay';

interface StudyHallViewProps {
  studyHall: {
    id: number;
    name: string;
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
    images: string[];
    mainImage: string;
    description: string;
    status: 'draft' | 'active' | 'inactive';
    rating: number;
    totalBookings: number;
    qrCode?: string;
  };
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
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toast } = useToast();

  const getAmenityIcon = (amenity: string) => {
    const icons = {
      'AC': <Car className="h-4 w-4" />,
      'Wi-Fi': <Wifi className="h-4 w-4" />,
      'Parking': <Car className="h-4 w-4" />,
      'Power Outlets': <Zap className="h-4 w-4" />,
      'Water Cooler': <Droplets className="h-4 w-4" />,
      'Washroom': <Bath className="h-4 w-4" />,
      'Coffee': <Coffee className="h-4 w-4" />
    };
    return icons[amenity as keyof typeof icons] || <Star className="h-4 w-4" />;
  };

  const copyBookingLink = () => {
    const bookingLink = studyHall.qrCode || `${window.location.origin}/book/${studyHall.id}`;
    navigator.clipboard.writeText(bookingLink);
    toast({
      title: "Copied!",
      description: "Booking link copied to clipboard",
    });
  };

  const seatColors = {
    available: 'bg-green-500 text-white',
    occupied: 'bg-red-500 text-white',
    maintenance: 'bg-yellow-500 text-white',
    disabled: 'bg-gray-500 text-white'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{studyHall.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(studyHall.status)}>
                  {studyHall.status.charAt(0).toUpperCase() + studyHall.status.slice(1)}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{studyHall.rating}</span>
                  <span>•</span>
                  <span>{studyHall.totalBookings} bookings</span>
                </div>
              </div>
            </div>
            <Button onClick={onEdit} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and QR Code */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                {studyHall.images.length > 0 ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                      <img
                        src={studyHall.images[activeImageIndex]}
                        alt={studyHall.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {studyHall.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2 p-4">
                        {studyHall.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 ${
                              index === activeImageIndex ? 'border-blue-500' : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${studyHall.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Students can scan this QR code to book directly
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowQRCode(true)}>
                    <QrCode className="h-4 w-4 mr-2" />
                    View QR
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyBookingLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(studyHall.qrCode || `${window.location.origin}/book/${studyHall.id}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Test Booking Page
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Details */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Merchant</p>
                    <p className="text-lg">{studyHall.merchantName}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Location
                    </p>
                    <p className="text-lg">{studyHall.location}</p>
                    <p className="text-xs text-gray-500">
                      GPS: {studyHall.gpsLocation.lat.toFixed(6)}, {studyHall.gpsLocation.lng.toFixed(6)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Capacity
                    </p>
                    <p className="text-lg">{studyHall.capacity} seats total</p>
                    <p className="text-sm text-gray-500">{studyHall.rows} rows × {studyHall.seatsPerRow} seats</p>
                  </div>

                  {studyHall.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Description</p>
                      <p className="text-sm text-gray-700">{studyHall.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Per Day</p>
                      <p className="text-sm text-gray-600">Single day booking</p>
                    </div>
                    <p className="text-xl font-bold text-blue-600">₹{studyHall.pricePerDay}</p>
                  </div>

                  {studyHall.pricePerWeek > 0 && (
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Per Week</p>
                        <p className="text-sm text-gray-600">7 days package</p>
                      </div>
                      <p className="text-xl font-bold text-green-600">₹{studyHall.pricePerWeek}</p>
                    </div>
                  )}

                  {studyHall.pricePerMonth > 0 && (
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">Per Month</p>
                        <p className="text-sm text-gray-600">30 days package</p>
                      </div>
                      <p className="text-xl font-bold text-purple-600">₹{studyHall.pricePerMonth}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {studyHall.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      {getAmenityIcon(amenity)}
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
                {studyHall.amenities.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No amenities listed</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Seat Layout */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seat Layout</CardTitle>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{studyHall.layout.filter(s => s.status !== 'disabled').length} Total Seats</span>
                  <span>{studyHall.layout.filter(s => s.status === 'available').length} Available</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Legend */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded" />
                    <span>Maintenance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded" />
                    <span>Disabled</span>
                  </div>
                </div>

                {/* Entrance */}
                <div className="text-center">
                  <div className="inline-block bg-gray-800 text-white px-4 py-1 rounded text-xs font-medium">
                    ENTRANCE
                  </div>
                </div>

                {/* Seat Grid */}
                <div className="space-y-1">
                  {Array.from({ length: studyHall.rows }, (_, rowIndex) => {
                    const rowLetter = String.fromCharCode(65 + rowIndex);
                    return (
                      <div key={rowLetter} className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                          {rowLetter}
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: studyHall.seatsPerRow }, (_, seatIndex) => {
                            const seatId = `${rowLetter}${seatIndex + 1}`;
                            const seat = studyHall.layout.find(s => s.id === seatId);
                            const status = seat?.status || 'available';
                            
                            return (
                              <div
                                key={seatId}
                                className={`w-8 h-6 text-xs font-medium rounded flex items-center justify-center ${seatColors[status]}`}
                                title={`${seatId} - ${status}`}
                              >
                                {seatId}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Column Numbers */}
                <div className="flex items-center gap-1 ml-7">
                  {Array.from({ length: studyHall.seatsPerRow }, (_, index) => (
                    <div key={index + 1} className="w-8 text-center text-xs text-gray-500">
                      {index + 1}
                    </div>
                  ))}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t">
                  {['available', 'occupied', 'maintenance', 'disabled'].map(status => {
                    const count = studyHall.layout.filter(seat => seat.status === status).length;
                    return (
                      <div key={status} className="p-2 bg-gray-50 rounded">
                        <div className="font-medium">{count}</div>
                        <div className="text-gray-600 capitalize">{status}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRCode && (
          <QRCodeDisplay
            qrCode={studyHall.qrCode || `${window.location.origin}/book/${studyHall.id}`}
            studyHallName={studyHall.name}
            onClose={() => setShowQRCode(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudyHallView;
