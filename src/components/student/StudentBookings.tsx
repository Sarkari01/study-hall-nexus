
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, QrCode, AlertCircle } from "lucide-react";

const StudentBookings = () => {
  const [activeTab, setActiveTab] = useState("current");

  // Mock booking data
  const currentBookings = [
    {
      id: 1,
      bookingReference: "BK-2024-00123456",
      studyHall: "Premium Study Room A",
      location: "Connaught Place, New Delhi",
      seats: ["A1", "A2"],
      startDate: "2024-06-17",
      endDate: "2024-06-23",
      startTime: "09:00",
      endTime: "21:00",
      bookingType: "weekly",
      status: "active",
      totalAmount: 600,
      qrCode: "QR_CODE_URL_HERE"
    }
  ];

  const pastBookings = [
    {
      id: 2,
      bookingReference: "BK-2024-00123455",
      studyHall: "Quiet Study Zone",
      location: "Karol Bagh, New Delhi",
      seats: ["B3"],
      startDate: "2024-06-10",
      endDate: "2024-06-10",
      startTime: "10:00",
      endTime: "18:00",
      bookingType: "daily",
      status: "completed",
      totalAmount: 35
    }
  ];

  const renderBookingCard = (booking: any, showQR = false) => (
    <Card key={booking.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{booking.studyHall}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{booking.location}</span>
            </div>
          </div>
          <Badge 
            variant={booking.status === 'active' ? 'default' : 'secondary'}
            className={booking.status === 'active' ? 'bg-green-100 text-green-800' : ''}
          >
            {booking.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-gray-600">
                {booking.startDate === booking.endDate 
                  ? booking.startDate 
                  : `${booking.startDate} to ${booking.endDate}`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <p className="font-medium">Time</p>
              <p className="text-gray-600">{booking.startTime} - {booking.endTime}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-gray-400" />
            <div>
              <p className="font-medium">Seats</p>
              <p className="text-gray-600">{booking.seats.join(', ')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div>
              <p className="font-medium">Amount</p>
              <p className="text-gray-600">₹{booking.totalAmount}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-gray-500">
            Booking ID: {booking.bookingReference}
          </span>
          <div className="flex gap-2">
            {showQR && booking.status === 'active' && (
              <Button variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-1" />
                QR Code
              </Button>
            )}
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Bookings</TabsTrigger>
          <TabsTrigger value="past">Booking History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {currentBookings.length > 0 ? (
            <div className="space-y-4">
              {currentBookings.map(booking => renderBookingCard(booking, true))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Bookings</h3>
                <p className="text-gray-600 mb-4">You don't have any active bookings at the moment.</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Find Study Halls
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastBookings.length > 0 ? (
            <div className="space-y-4">
              {pastBookings.map(booking => renderBookingCard(booking))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Booking History</h3>
                <p className="text-gray-600">Your completed bookings will appear here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Book Again
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <QrCode className="h-6 w-6 mb-2" />
              Check-in
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertCircle className="h-6 w-6 mb-2" />
              Report Issue
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentBookings;
