
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingDetailsFormProps {
  bookingForm: {
    startDate: string;
    startTime: string;
    endTime: string;
  };
  onFormChange: (field: string, value: string) => void;
}

const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  bookingForm,
  onFormChange
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Booking Details</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="startDate">Booking Date</Label>
            <Input
              id="startDate"
              type="date"
              value={bookingForm.startDate}
              onChange={(e) => onFormChange('startDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={bookingForm.startTime}
                onChange={(e) => onFormChange('startTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={bookingForm.endTime}
                onChange={(e) => onFormChange('endTime', e.target.value)}
              />
            </div>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              💡 Book for longer durations to get better rates!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingDetailsForm;
