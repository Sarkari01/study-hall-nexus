
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Building2, Calendar, FileText, Bell, Settings } from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      title: "Add Student",
      description: "Register a new student",
      icon: <UserPlus className="h-5 w-5" />,
      action: () => console.log("Add student clicked"),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Add Study Hall",
      description: "Register new study hall",
      icon: <Building2 className="h-5 w-5" />,
      action: () => console.log("Add study hall clicked"),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "View Bookings",
      description: "Manage today's bookings",
      icon: <Calendar className="h-5 w-5" />,
      action: () => console.log("View bookings clicked"),
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      title: "Generate Report",
      description: "Create financial report",
      icon: <FileText className="h-5 w-5" />,
      action: () => console.log("Generate report clicked"),
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Send Notification",
      description: "Broadcast to users",
      icon: <Bell className="h-5 w-5" />,
      action: () => console.log("Send notification clicked"),
      color: "bg-red-600 hover:bg-red-700"
    },
    {
      title: "System Settings",
      description: "Configure platform",
      icon: <Settings className="h-5 w-5" />,
      action: () => console.log("System settings clicked"),
      color: "bg-gray-600 hover:bg-gray-700"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex flex-col items-center justify-center space-y-2 ${action.color} text-white border-0`}
              onClick={action.action}
            >
              {action.icon}
              <div className="text-center">
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
