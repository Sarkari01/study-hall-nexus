import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, Eye, Building2 } from "lucide-react";

interface RecentBooking {
  id: string;
  studentName: string;
  studyHallName: string;
  location: string;
  timeSlot: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookedAt: string;
}

const RecentBookings: React.FC = () => {
  const recentBookings: RecentBooking[] = [
    {
      id: "BOK000123",
      studentName: "Rajesh Kumar",
      studyHallName: "Central Study Hub",
      location: "Delhi",
      timeSlot: "09:00 - 17:00",
      amount: 250,
      status: "confirmed",
      bookedAt: "2 hours ago"
    },
    {
      id: "BOK000124",
      studentName: "Priya Sharma",
      studyHallName: "Elite Library",
      location: "Mumbai",
      timeSlot: "10:00 - 18:00",
      amount: 300,
      status: "pending",
      bookedAt: "3 hours ago"
    },
    {
      id: "BOK000125",
      studentName: "Amit Singh",
      studyHallName: "Study Zone Pro",
      location: "Bangalore",
      timeSlot: "08:00 - 16:00",
      amount: 200,
      status: "confirmed",
      bookedAt: "5 hours ago"
    },
    {
      id: "BOK000126",
      studentName: "Sneha Patel",
      studyHallName: "Focus Point",
      location: "Pune",
      timeSlot: "11:00 - 19:00",
      amount: 280,
      status: "cancelled",
      bookedAt: "6 hours ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Bookings</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{booking.studentName}</span>
                    <Badge variant="outline" className="text-xs">
                      {booking.id}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-3 w-3" />
                    <span>{booking.studyHallName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{booking.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{booking.timeSlot}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">{booking.bookedAt}</span>
                  <span className="font-semibold text-gray-900">₹{booking.amount}</span>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="ml-4">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBookings;
