
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, DollarSign, Star } from "lucide-react";

interface StatsCardsProps {
  studyHalls: any[];
  bookings: any[];
}

const DashboardStatsCards: React.FC<StatsCardsProps> = ({ studyHalls, bookings }) => {
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
      value: bookings.length.toString(),
      change: "+12% from last month",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: `₹${bookings.reduce((sum, booking) => sum + (booking.final_amount || 0), 0).toLocaleString()}`,
      change: "+8.5% from last month",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      title: "Average Rating",
      value: studyHalls.length > 0 ? (studyHalls.reduce((sum, hall) => sum + hall.rating, 0) / studyHalls.length).toFixed(1) : "0.0",
      change: "+0.2 from last month",
      icon: <Star className="h-5 w-5" />,
      color: "text-yellow-600"
    }
  ];

  return (
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
  );
};

export default DashboardStatsCards;
