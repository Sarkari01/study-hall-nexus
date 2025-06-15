
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle, Users, DollarSign } from "lucide-react";

interface StudyHallStatsProps {
  totalHalls: number;
  activeHalls: number;
  totalCapacity: number;
  totalRevenue: number;
}

const StudyHallStats = ({ totalHalls, activeHalls, totalCapacity, totalRevenue }: StudyHallStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card key="total-halls">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Study Halls</p>
              <p className="text-2xl font-bold">{totalHalls}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card key="active-halls">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Active Halls</p>
              <p className="text-2xl font-bold">{activeHalls}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card key="total-capacity">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold">{totalCapacity}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card key="total-revenue">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyHallStats;
