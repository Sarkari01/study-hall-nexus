
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PriceBreakdownProps {
  baseAmount: number;
  taxes: number;
  processingFee: number;
  finalAmount: number;
  seatCount: number;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  baseAmount,
  taxes,
  processingFee,
  finalAmount,
  seatCount
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Base Amount ({seatCount} seats)</span>
          <span>₹{baseAmount}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>GST (18%)</span>
          <span>₹{taxes}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Processing Fee</span>
          <span>₹{processingFee}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total Amount</span>
          <span>₹{finalAmount}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceBreakdown;
