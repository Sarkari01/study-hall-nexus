
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Calendar, TrendingUp, Building2, ShoppingCart, CreditCard, UserPlus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, color, subtitle }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>
          <div className={`p-3 rounded-full bg-gray-100 ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const stats = [
    {
      title: "Today's Bookings",
      value: "147",
      change: "+23.5%",
      changeType: 'positive' as const,
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-600",
      subtitle: "Active sessions: 89"
    },
    {
      title: "Today's Revenue",
      value: "₹2,45,680",
      change: "+15.3%",
      changeType: 'positive' as const,
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600",
      subtitle: "Avg per booking: ₹1,673"
    },
    {
      title: "Active Merchants",
      value: "186",
      change: "+8.2%",
      changeType: 'positive' as const,
      icon: <Building2 className="h-5 w-5" />,
      color: "text-purple-600",
      subtitle: "Online now: 142"
    },
    {
      title: "Total Students",
      value: "2,350",
      change: "+12.7%",
      changeType: 'positive' as const,
      icon: <Users className="h-5 w-5" />,
      color: "text-orange-600",
      subtitle: "Active today: 1,234"
    },
    {
      title: "Pending Payments",
      value: "₹45,320",
      change: "-5.1%",
      changeType: 'negative' as const,
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-red-600",
      subtitle: "23 transactions"
    },
    {
      title: "New Registrations",
      value: "34",
      change: "+18.9%",
      changeType: 'positive' as const,
      icon: <UserPlus className="h-5 w-5" />,
      color: "text-indigo-600",
      subtitle: "This week"
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1%",
      changeType: 'positive' as const,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-emerald-600",
      subtitle: "Payment success"
    },
    {
      title: "Avg Session Time",
      value: "2.4h",
      change: "+0.3h",
      changeType: 'positive' as const,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "text-cyan-600",
      subtitle: "Per booking"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
