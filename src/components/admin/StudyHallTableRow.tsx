
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Eye, Edit, CheckCircle, XCircle } from "lucide-react";

interface StudyHall {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price_per_day: number;
  total_revenue: number;
  total_bookings: number;
  rating: number;
  status: 'draft' | 'active' | 'inactive' | 'maintenance';
  is_featured: boolean;
}

interface StudyHallTableRowProps {
  hall: StudyHall;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

const StudyHallTableRow = ({ hall, onToggleStatus }: StudyHallTableRowProps) => {
  return (
    <TableRow key={hall.id}>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-medium">{hall.name}</span>
          {hall.is_featured && (
            <Badge variant="secondary" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-gray-400" />
          {hall.location}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{hall.capacity} seats</Badge>
      </TableCell>
      <TableCell className="font-medium">₹{hall.price_per_day}</TableCell>
      <TableCell className="font-medium text-green-600">
        ₹{hall.total_revenue?.toLocaleString() || 0}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{hall.total_bookings}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          {hall.rating.toFixed(1)}
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant={hall.status === 'active' ? 'default' : 'secondary'}
          className={hall.status === 'active' ? 'bg-green-100 text-green-800' : ''}
        >
          {hall.status === 'active' ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3 mr-1" />
              {hall.status}
            </>
          )}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant={hall.status === 'active' ? 'destructive' : 'default'}
            size="sm"
            onClick={() => onToggleStatus(hall.id, hall.status)}
          >
            {hall.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default StudyHallTableRow;
