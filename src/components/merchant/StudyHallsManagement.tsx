
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar, Star, DollarSign, Eye, Edit, Plus } from "lucide-react";

interface StudyHallsManagementProps {
  studyHalls: any[];
  onCreateClick: () => void;
  onViewClick: (hall: any) => void;
  onEditClick: (hall: any) => void;
}

const StudyHallsManagement: React.FC<StudyHallsManagementProps> = ({
  studyHalls,
  onCreateClick,
  onViewClick,
  onEditClick
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Study Halls Management</h2>
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Study Hall
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyHalls.map((hall) => (
          <Card key={hall.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{hall.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{hall.location}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={hall.status === 'active' ? 'default' : 'secondary'}
                    className={hall.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {hall.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{hall.capacity} seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{hall.total_bookings} bookings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{hall.rating} rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>₹{hall.price_per_day}/day</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onViewClick(hall)} className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEditClick(hall)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudyHallsManagement;
