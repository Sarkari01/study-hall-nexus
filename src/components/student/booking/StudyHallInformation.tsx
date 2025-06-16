
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";

interface StudyHallInformationProps {
  studyHall: any;
}

const StudyHallInformation: React.FC<StudyHallInformationProps> = ({ studyHall }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Study Hall Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>Capacity: {studyHall.capacity} seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>Hours: 24/7</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {studyHall.amenities?.map((amenity: string) => (
              <Badge key={amenity} variant="outline">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
        
        {studyHall.description && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-gray-600">{studyHall.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyHallInformation;
