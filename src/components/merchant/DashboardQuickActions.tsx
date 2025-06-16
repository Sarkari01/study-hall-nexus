
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, TrendingUp, DollarSign } from "lucide-react";

interface QuickActionsProps {
  onTabChange: (tab: string) => void;
}

const DashboardQuickActions: React.FC<QuickActionsProps> = ({ onTabChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onTabChange("study-halls")}
          >
            <Plus className="h-6 w-6 mb-2" />
            Add Study Hall
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onTabChange("bookings")}
          >
            <Calendar className="h-6 w-6 mb-2" />
            View Bookings
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onTabChange("analytics")}
          >
            <TrendingUp className="h-6 w-6 mb-2" />
            Analytics
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <DollarSign className="h-6 w-6 mb-2" />
            Revenue Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActions;
