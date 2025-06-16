
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookingSummaryCardProps {
  selectedSeats: string[];
  studyHall: any;
  calculateTotal: () => number;
  onProceedToPayment: () => void;
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  selectedSeats,
  studyHall,
  calculateTotal,
  onProceedToPayment
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
        
        <div className="space-y-4">
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Selected Seats:</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Rate per seat:</span>
              <span>₹{studyHall.price_per_day}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t">
              <span>Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <Button 
              onClick={onProceedToPayment} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Proceed to Payment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummaryCard;
