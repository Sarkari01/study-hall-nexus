
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarContent, AvatarFallback } from "@/components/ui/avatar";
import { Clock, UserPlus, DollarSign, Building2, AlertTriangle, CheckCircle } from "lucide-react";

interface Activity {
  id: string;
  type: 'registration' | 'payment' | 'merchant_approval' | 'booking' | 'alert';
  title: string;
  description: string;
  time: string;
  user?: string;
  amount?: number;
  status?: 'success' | 'pending' | 'warning' | 'error';
}

const RecentActivities = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'registration',
      title: 'New Student Registration',
      description: 'Ankit Sharma joined from Delhi University',
      time: '2 minutes ago',
      user: 'Ankit Sharma',
      status: 'success'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      description: 'Study hall booking payment processed',
      time: '5 minutes ago',
      amount: 1250,
      status: 'success'
    },
    {
      id: '3',
      type: 'merchant_approval',
      title: 'Merchant Verification Pending',
      description: 'New merchant application requires review',
      time: '12 minutes ago',
      user: 'Ravi Patel',
      status: 'pending'
    },
    {
      id: '4',
      type: 'booking',
      title: 'High Volume Alert',
      description: 'Connaught Place location reaching capacity',
      time: '18 minutes ago',
      status: 'warning'
    },
    {
      id: '5',
      type: 'payment',
      title: 'Settlement Completed',
      description: 'Weekly merchant settlement processed',
      time: '25 minutes ago',
      amount: 45000,
      status: 'success'
    },
    {
      id: '6',
      type: 'alert',
      title: 'System Maintenance',
      description: 'Scheduled maintenance completed successfully',
      time: '1 hour ago',
      status: 'success'
    }
  ];

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case 'registration':
        return <UserPlus className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'merchant_approval':
        return <Building2 className="h-4 w-4" />;
      case 'booking':
        return <Clock className="h-4 w-4" />;
      case 'alert':
        return status === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                {getActivityIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 ml-2">
                    {activity.time}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  {activity.user && (
                    <div className="flex items-center space-x-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">{activity.user}</span>
                    </div>
                  )}
                  {activity.amount && (
                    <Badge variant="outline" className="text-xs">
                      ₹{activity.amount.toLocaleString()}
                    </Badge>
                  )}
                  {activity.status && (
                    <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
