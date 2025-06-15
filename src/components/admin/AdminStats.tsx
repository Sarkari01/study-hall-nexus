
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface StatItem {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

const AdminStats: React.FC = () => {
  const stats: StatItem[] = [
    {
      title: "Total Students",
      value: "2,847",
      change: 12.5,
      changeType: 'increase',
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Active Study Halls",
      value: "156",
      change: 8.2,
      changeType: 'increase',
      icon: <Building2 className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Today's Bookings",
      value: "247",
      change: -3.1,
      changeType: 'decrease',
      icon: <Calendar className="h-5 w-5" />,
      color: "text-orange-600"
    },
    {
      title: "Revenue (This Month)",
      value: "₹1,24,580",
      change: 15.7,
      changeType: 'increase',
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={stat.color}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="flex items-center text-sm">
              {stat.changeType === 'increase' ? (
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(stat.change)}%
              </span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
