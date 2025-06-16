
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingSummaryCardProps {
  studyHallName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  selectedSeats: string[];
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  studyHallName,
  bookingDate,
  startTime,
  endTime,
  selectedSeats
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Study Hall:</span>
          <span className="font-medium">{studyHallName}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{bookingDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{startTime} - {endTime}</span>
        </div>
        <div className="flex justify-between">
          <span>Seats:</span>
          <span>{selectedSeats.join(', ')}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummaryCard;
