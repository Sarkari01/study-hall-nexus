
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Star, Users, Filter, Heart, ArrowRight } from "lucide-react";
import { useCapacitor } from '@/hooks/useCapacitor';
import MobileBookingFlow from './MobileBookingFlow';

const MobileStudentApp = () => {
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isNative } = useCapacitor();

  // Mock study halls data
  const studyHalls = [
    {
      id: 1,
      name: "Central Library Study Hall",
      location: "Connaught Place, Delhi",
      distance: "0.8 km",
      rating: 4.5,
      reviews: 128,
      price: 50,
      availableSeats: 24,
      totalSeats: 50,
      image: "/placeholder.svg",
      amenities: ["WiFi", "AC", "Silent Zone", "Charging Points"],
      openTime: "6:00 AM",
      closeTime: "11:00 PM"
    },
    {
      id: 2,
      name: "Premium Study Zone",
      location: "Karol Bagh, Delhi",
      distance: "1.2 km",
      rating: 4.8,
      reviews: 89,
      price: 75,
      availableSeats: 12,
      totalSeats: 30,
      image: "/placeholder.svg",
      amenities: ["WiFi", "AC", "Private Desks", "Coffee"],
      openTime: "7:00 AM",
      closeTime: "10:00 PM"
    },
    {
      id: 3,
      name: "24/7 Study Center",
      location: "Rajouri Garden, Delhi",
      distance: "2.1 km",
      rating: 4.2,
      reviews: 156,
      price: 40,
      availableSeats: 18,
      totalSeats: 40,
      image: "/placeholder.svg",
      amenities: ["WiFi", "24/7", "Security", "Lockers"],
      openTime: "24 Hours",
      closeTime: "24 Hours"
    }
  ];

  const handleBookNow = (hall: any) => {
    setSelectedHall(hall);
    setShowBookingFlow(true);
  };

  const handleBookingComplete = (bookingData: any) => {
    console.log('Booking completed:', bookingData);
    setShowBookingFlow(false);
    setSelectedHall(null);
    // Show success message or redirect
  };

  if (showBookingFlow && selectedHall) {
    return (
      <MobileBookingFlow
        studyHall={selectedHall}
        onComplete={handleBookingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Find Study Halls</h1>
              <p className="text-sm text-gray-600">Book your perfect study space</p>
            </div>
            <Button variant="ghost" size="sm">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by location or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Study Halls List */}
      <div className="p-4 space-y-4">
        {studyHalls.map((hall) => (
          <Card key={hall.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={hall.image}
                alt={hall.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <Button variant="ghost" size="sm" className="bg-white/80 p-2">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-green-600 text-white">
                  {hall.availableSeats} seats available
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{hall.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{hall.location}</span>
                    <span className="mx-1">•</span>
                    <span>{hall.distance}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{hall.rating}</span>
                    <span className="text-sm text-gray-500">({hall.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-3">
                {hall.amenities.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {hall.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{hall.amenities.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Timing & Availability */}
              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{hall.openTime} - {hall.closeTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{hall.availableSeats}/{hall.totalSeats} available</span>
                </div>
              </div>

              {/* Price & Book Button */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-green-600">₹{hall.price}</span>
                  <span className="text-sm text-gray-500">/hour</span>
                </div>
                <Button 
                  onClick={() => handleBookNow(hall)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Filters */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-2 overflow-x-auto">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Nearby
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            24/7 Open
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Under ₹50
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            High Rated
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileStudentApp;
