
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  DollarSign, 
  Calendar, 
  Building2, 
  CheckCircle, 
  AlertCircle,
  Clock,
  MoreHorizontal,
  UserPlus
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'booking' | 'payment' | 'registration' | 'verification';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  amount?: number;
  status?: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
  loading?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities = [], 
  loading = false 
}) => {
  const getActivityIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    
    switch (type) {
      case 'registration':
        return <UserPlus className={iconClass} />;
      case 'payment':
        return <DollarSign className={iconClass} />;
      case 'booking':
        return <Calendar className={iconClass} />;
      case 'verification':
        return <CheckCircle className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'confirmed':
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const defaultActivities: Activity[] = [
    {
      id: '1',
      type: 'registration',
      title: 'New Student Registration',
      description: 'John Doe has registered as a new student',
      timestamp: '5 minutes ago',
      user: 'John Doe',
      status: 'completed'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      description: 'Booking payment of ₹500 received',
      timestamp: '10 minutes ago',
      amount: 500,
      status: 'completed'
    },
    {
      id: '3',
      type: 'registration',
      title: 'New Merchant Application',
      description: 'StudyHub Central has applied for merchant verification',
      timestamp: '1 hour ago',
      status: 'pending'
    },
    {
      id: '4',
      type: 'booking',
      title: 'Booking Confirmed',
      description: 'Seat A1 booked for tomorrow at 9:00 AM',
      timestamp: '2 hours ago',
      status: 'confirmed'
    },
    {
      id: '5',
      type: 'verification',
      title: 'Verification Complete',
      description: 'Merchant verification completed successfully',
      timestamp: '3 hours ago',
      status: 'approved'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activities</CardTitle>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {activity.user && (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">{activity.user}</span>
                      </div>
                    )}
                    
                    {activity.status && (
                      <Badge variant="outline" className="text-xs">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">
                      ₹{activity.amount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm">
            View All Activities
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
