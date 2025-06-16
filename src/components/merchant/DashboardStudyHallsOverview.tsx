
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, Star, Plus, Loader2 } from "lucide-react";

interface StudyHallsOverviewProps {
  studyHalls: any[];
  studyHallsLoading: boolean;
  onTabChange: (tab: string) => void;
}

const DashboardStudyHallsOverview: React.FC<StudyHallsOverviewProps> = ({
  studyHalls,
  studyHallsLoading,
  onTabChange
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Study Halls</CardTitle>
          <Button onClick={() => onTabChange("study-halls")} variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {studyHallsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading study halls...</span>
          </div>
        ) : studyHalls.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Study Halls Yet</h3>
            <p className="text-gray-600 mb-4">Create your first study hall to start accepting bookings</p>
            <Button onClick={() => onTabChange("study-halls")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Study Hall
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyHalls.slice(0, 3).map((hall) => (
              <Card key={hall.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-lg">{hall.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{hall.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{hall.capacity} seats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{hall.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">₹{hall.price_per_day}/day</span>
                      <Badge variant={hall.status === 'active' ? "default" : "secondary"}>
                        {hall.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStudyHallsOverview;
