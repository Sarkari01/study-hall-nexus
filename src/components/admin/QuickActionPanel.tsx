
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Settings,
  UserPlus,
  Plus,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  onClick: () => void;
  disabled?: boolean;
}

interface QuickActionPanelProps {
  onNavigate: (route: string) => void;
  pendingCounts?: {
    merchants: number;
    bookings: number;
    students: number;
  };
}

const QuickActionPanel: React.FC<QuickActionPanelProps> = ({ 
  onNavigate, 
  pendingCounts = { merchants: 0, bookings: 0, students: 0 }
}) => {
  const quickActions: QuickAction[] = [
    {
      id: 'add-student',
      title: 'Add Student',
      description: 'Register a new student',
      icon: <UserPlus className="h-5 w-5" />,
      onClick: () => onNavigate('students'),
    },
    {
      id: 'approve-merchants',
      title: 'Review Merchants',
      description: 'Approve pending applications',
      icon: <Building2 className="h-5 w-5" />,
      badge: pendingCounts.merchants > 0 ? pendingCounts.merchants.toString() : undefined,
      badgeVariant: 'destructive',
      onClick: () => onNavigate('merchants'),
    },
    {
      id: 'manage-bookings',
      title: 'Manage Bookings',
      description: 'View and update bookings',
      icon: <Calendar className="h-5 w-5" />,
      badge: pendingCounts.bookings > 0 ? pendingCounts.bookings.toString() : undefined,
      badgeVariant: 'secondary',
      onClick: () => onNavigate('bookings'),
    },
    {
      id: 'view-analytics',
      title: 'Analytics',
      description: 'View detailed reports',
      icon: <TrendingUp className="h-5 w-5" />,
      onClick: () => onNavigate('analytics'),
    },
    {
      id: 'financial-reports',
      title: 'Financial Reports',
      description: 'Revenue and transactions',
      icon: <DollarSign className="h-5 w-5" />,
      onClick: () => onNavigate('payments'),
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure application',
      icon: <Settings className="h-5 w-5" />,
      onClick: () => onNavigate('settings'),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start text-left relative"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.badge && (
                <Badge 
                  variant={action.badgeVariant || 'default'} 
                  className="absolute -top-2 -right-2 text-xs"
                >
                  {action.badge}
                </Badge>
              )}
              <div className="flex items-center gap-3 w-full mb-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{action.title}</h4>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-left">
                {action.description}
              </p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionPanel;
