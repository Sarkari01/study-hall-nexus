
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Clock, 
  Star, 
  Search,
  Calendar,
  CreditCard,
  Gift,
  History
} from "lucide-react";

const StudentPortal = () => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const nearbyHalls = [
    {
      id: 1,
      name: "Central Study Hub",
      location: "Andheri West, Mumbai",
      distance: "0.8 km",
      rating: 4.8,
      price: "₹50/hour",
      available: 12,
      total: 20,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Elite Library",
      location: "Bandra East, Mumbai",
      distance: "1.2 km",
      rating: 4.6,
      price: "₹45/hour",
      available: 8,
      total: 15,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Study Zone Pro",
      location: "Powai, Mumbai",
      distance: "2.1 km",
      rating: 4.9,
      price: "₹60/hour",
      available: 15,
      total: 25,
      image: "/placeholder.svg"
    }
  ];

  const seatLayout = [
    ['A1', 'A2', '', 'A3', 'A4'],
    ['B1', 'B2', '', 'B3', 'B4'],
    ['C1', 'C2', '', 'C3', 'C4'],
    ['', '', '', '', ''],
    ['D1', 'D2', '', 'D3', 'D4'],
    ['E1', 'E2', '', 'E3', 'E4']
  ];

  const occupiedSeats = ['A1', 'B3', 'C2', 'D4'];

  const bookingHistory = [
    {
      hall: "Central Study Hub",
      seat: "A2",
      date: "15 Jun 2024",
      duration: "4 hours",
      amount: "₹200",
      status: "Completed"
    },
    {
      hall: "Elite Library",
      seat: "B1",
      date: "14 Jun 2024",
      duration: "6 hours",
      amount: "₹270",
      status: "Completed"
    }
  ];

  const SeatSelector = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Select Your Seat</CardTitle>
        <p className="text-sm text-gray-600">Pick your perfect seat. No noise. No distractions.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-6">
          {seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.map((seat, seatIndex) => {
                if (!seat) return <div key={seatIndex} className="w-10 h-10" />;
                
                const isOccupied = occupiedSeats.includes(seat);
                const isSelected = selectedSeat === seat;
                
                return (
                  <button
                    key={seat}
                    onClick={() => !isOccupied && setSelectedSeat(seat)}
                    disabled={isOccupied}
                    className={`
                      w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all
                      ${isOccupied 
                        ? 'bg-red-100 border-red-300 text-red-800 cursor-not-allowed' 
                        : isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200'
                      }
                    `}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Occupied</span>
          </div>
        </div>
        
        {selectedSeat && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-900">Selected Seat: {selectedSeat}</p>
            <Button 
              className="mt-2 w-full" 
              onClick={() => setShowBookingForm(true)}
            >
              Proceed to Book
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const BookingForm = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Duration</Label>
            <select className="w-full p-2 border rounded-lg">
              <option>2 hours</option>
              <option>4 hours</option>
              <option>6 hours</option>
              <option>8 hours</option>
            </select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" />
          </div>
        </div>
        
        <div>
          <Label>Coupon Code</Label>
          <div className="flex gap-2">
            <Input placeholder="Enter referral code to unlock free hours" />
            <Button variant="outline">Apply</Button>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span>Seat {selectedSeat} - 4 hours</span>
            <span>₹200</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>Platform fee</span>
            <span>₹10</span>
          </div>
          <div className="border-t pt-2 flex justify-between items-center font-semibold">
            <span>Total</span>
            <span>₹210</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button className="flex-1">
            <CreditCard className="h-4 w-4 mr-2" />
            Pay Now
          </Button>
          <Button variant="outline" onClick={() => setShowBookingForm(false)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Find Your Study Space</h1>
          <p className="text-gray-600">Discover quiet study halls near you</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search by location, area, or landmark" 
                    className="pl-10"
                  />
                </div>
              </div>
              <Button>
                <MapPin className="h-4 w-4 mr-2" />
                Near Me
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Study Halls List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {nearbyHalls.map((hall) => (
                <Card key={hall.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img 
                        src={hall.image} 
                        alt={hall.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{hall.name}</h3>
                          <Badge variant="outline" className="text-green-600">
                            {hall.available}/{hall.total} available
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {hall.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {hall.distance}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {hall.rating}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-blue-600">{hall.price}</span>
                          <Button size="sm">Book Now</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Rewards & Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Refer & Earn</p>
                    <p className="text-xs text-green-600">Get 2 hours free for each referral</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">First Booking</p>
                    <p className="text-xs text-blue-600">20% off on your first booking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookingHistory.map((booking, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{booking.hall}</p>
                      <p className="text-xs text-gray-600">
                        {booking.seat} • {booking.date} • {booking.duration}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm font-medium">{booking.amount}</span>
                        <Badge variant="outline" className="text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Seat Selection (shown when a hall is selected) */}
        <SeatSelector />
        
        {/* Booking Form (shown when seat is selected) */}
        {showBookingForm && <BookingForm />}
      </div>
    </div>
  );
};

export default StudentPortal;
