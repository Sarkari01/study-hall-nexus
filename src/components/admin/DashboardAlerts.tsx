
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, CheckCircle, X, Bell } from "lucide-react";

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
}

interface DashboardAlertsProps {
  alerts?: Alert[];
  onDismiss?: (alertId: string) => void;
}

const DashboardAlerts: React.FC<DashboardAlertsProps> = ({ 
  alerts = [], 
  onDismiss 
}) => {
  const defaultAlerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'High Booking Volume',
      message: 'Study halls are experiencing high demand. Consider optimizing capacity.',
      timestamp: '5 minutes ago',
      actionLabel: 'View Details',
      dismissible: true,
    },
    {
      id: '2',
      type: 'info',
      title: 'New Merchant Pending',
      message: '3 new merchant applications require review and approval.',
      timestamp: '1 hour ago',
      actionLabel: 'Review',
      dismissible: true,
    },
    {
      id: '3',
      type: 'success',
      title: 'System Update Complete',
      message: 'Dashboard analytics have been successfully updated.',
      timestamp: '2 hours ago',
      dismissible: true,
    },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <X className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertColors = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info': return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'success': return 'border-green-200 bg-green-50 text-green-800';
      case 'error': return 'border-red-200 bg-red-50 text-red-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'warning': return 'secondary';
      case 'info': return 'default';
      case 'success': return 'default';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  if (displayAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p>All systems operating normally</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          System Alerts
          <Badge variant="outline" className="ml-auto">
            {displayAlerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${getAlertColors(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90 mb-2">{alert.message}</p>
                    <p className="text-xs opacity-75">{alert.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {alert.actionLabel && alert.onAction && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={alert.onAction}
                      className="text-xs"
                    >
                      {alert.actionLabel}
                    </Button>
                  )}
                  {alert.dismissible && onDismiss && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDismiss(alert.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
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

export default DashboardAlerts;
