
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MapPin, Clock, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const InchargeDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { userProfile } = useAuth();

  // Mock data for study hall
  const studyHall = {
    name: "Downtown Study Hub",
    location: "123 Main Street, City Center",
    capacity: 50,
    currentOccupancy: 32,
    status: "active"
  };

  // Mock data for today's bookings
  const todayBookings = [
    {
      id: 1,
      studentName: "John Doe",
      seatNumber: "A-15",
      timeSlot: "9:00 AM - 1:00 PM",
      status: "checked-in",
      checkInTime: "8:55 AM"
    },
    {
      id: 2,
      studentName: "Jane Smith",
      seatNumber: "B-08",
      timeSlot: "10:00 AM - 6:00 PM",
      status: "booked",
      checkInTime: null
    },
    {
      id: 3,
      studentName: "Mike Johnson",
      seatNumber: "C-22",
      timeSlot: "2:00 PM - 8:00 PM",
      status: "checked-out",
      checkInTime: "1:58 PM"
    }
  ];

  // Mock data for seat layout
  const seatLayout = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    seatNumber: `${String.fromCharCode(65 + Math.floor(i / 10))}-${String(i % 10 + 1).padStart(2, '0')}`,
    isOccupied: Math.random() > 0.4,
    studentName: Math.random() > 0.4 ? `Student ${i + 1}` : null,
    timeSlot: "9:00 AM - 6:00 PM"
  }));

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Study Hall Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Study Hall Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{studyHall.name}</h3>
              <p className="text-gray-600">{studyHall.location}</p>
            </div>
            <div className="text-right">
              <Badge variant={studyHall.status === 'active' ? 'default' : 'secondary'}>
                {studyHall.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold">{studyHall.capacity}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Occupancy</p>
                <p className="text-2xl font-bold">{studyHall.currentOccupancy}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Seats</p>
                <p className="text-2xl font-bold">{studyHall.capacity - studyHall.currentOccupancy}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold">{Math.round((studyHall.currentOccupancy / studyHall.capacity) * 100)}%</p>
              </div>
              <AlertCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium">{booking.studentName}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Seat: {booking.seatNumber}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {booking.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {booking.checkInTime && (
                    <span className="text-sm text-gray-600">
                      Check-in: {booking.checkInTime}
                    </span>
                  )}
                  <Badge variant={
                    booking.status === 'checked-in' ? 'default' :
                    booking.status === 'checked-out' ? 'secondary' : 'outline'
                  }>
                    {booking.status}
                  </Badge>
                  {booking.status === 'booked' && (
                    <Button size="sm">Check In</Button>
                  )}
                  {booking.status === 'checked-in' && (
                    <Button size="sm" variant="outline">Check Out</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSeatManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seat Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {seatLayout.map((seat) => (
              <div
                key={seat.id}
                className={`
                  aspect-square flex items-center justify-center text-xs font-medium rounded-lg border-2 cursor-pointer
                  ${seat.isOccupied 
                    ? 'bg-red-100 border-red-300 text-red-800' 
                    : 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200'
                  }
                `}
                title={seat.isOccupied ? `Occupied by ${seat.studentName}` : 'Available'}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-sm">Occupied</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCheckInOut = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Check-in/Check-out</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button className="flex-1">Scan QR Code</Button>
              <Button variant="outline" className="flex-1">Manual Entry</Button>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Pending Check-ins</h4>
              <div className="space-y-2">
                {todayBookings
                  .filter(b => b.status === 'booked')
                  .map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <span className="font-medium">{booking.studentName}</span>
                        <span className="text-sm text-gray-600 ml-2">({booking.seatNumber})</span>
                      </div>
                      <Button size="sm">Check In</Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "seats":
        return renderSeatManagement();
      case "checkin":
        return renderCheckInOut();
      default:
        return renderOverview();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <div className="flex-1">
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="lg:hidden" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Incharge Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {userProfile?.full_name}</p>
                  </div>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="seats">Seat Management</TabsTrigger>
                  <TabsTrigger value="checkin">Check-in/out</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  {renderOverview()}
                </TabsContent>
                
                <TabsContent value="seats" className="mt-6">
                  {renderSeatManagement()}
                </TabsContent>
                
                <TabsContent value="checkin" className="mt-6">
                  {renderCheckInOut()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default InchargeDashboard;
