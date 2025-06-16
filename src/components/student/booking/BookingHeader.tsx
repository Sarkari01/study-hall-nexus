
import React from 'react';
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Star } from "lucide-react";

interface BookingHeaderProps {
  studyHall: any;
  activeTab: string;
  onBack: () => void;
  showBackButton: boolean;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({
  studyHall,
  activeTab,
  onBack,
  showBackButton
}) => {
  return (
    <div className="flex items-center gap-4">
      {showBackButton && (
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <div>
        <DialogTitle className="text-2xl">{studyHall.name}</DialogTitle>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{studyHall.location}</span>
          <Star className="h-4 w-4 text-yellow-400 fill-current ml-2" />
          <span>{studyHall.rating || 0} ({studyHall.total_bookings || 0} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default BookingHeader;
