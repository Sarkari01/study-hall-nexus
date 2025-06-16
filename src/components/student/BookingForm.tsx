
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Wallet } from "lucide-react";

interface BookingFormProps {
  studyHall: any;
  selectedSeats: string[];
  bookingType: 'day' | 'week' | 'month';
  totalAmount: number;
  onConfirm: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  studyHall,
  selectedSeats,
  bookingType,
  totalAmount,
  onConfirm
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('upi');
  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '09:00',
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const paymentMethods = [
    { id: 'upi', label: 'UPI Payment', icon: Smartphone },
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'wallet', label: 'Wallet', icon: Wallet }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-semibold">Payment Method</Label>
            <div className="grid grid-cols-1 gap-3 mt-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`
                    flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                    ${paymentMethod === method.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <method.icon className="h-5 w-5" />
                  <span className="font-medium">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'upi' && (
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="your-upi@bank"
                value={formData.upiId}
                onChange={(e) => handleInputChange('upiId', e.target.value)}
              />
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input
                  id="nameOnCard"
                  placeholder="John Doe"
                  value={formData.nameOnCard}
                  onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                />
              </div>
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Your wallet balance: ₹1,250
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Wallet payments are instant and secure
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{studyHall.name}</h3>
            <p className="text-sm text-gray-600">{studyHall.location}</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Selected Seats:</span>
              <span>{selectedSeats.join(', ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Booking Type:</span>
              <span className="capitalize">{bookingType}ly</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Number of Seats:</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rate per seat:</span>
              <span>₹{totalAmount / selectedSeats.length}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Fee:</span>
              <span>₹{Math.round(totalAmount * 0.05)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GST (18%):</span>
              <span>₹{Math.round(totalAmount * 0.18)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount:</span>
              <span>₹{Math.round(totalAmount * 1.23)}</span>
            </div>
          </div>

          <Button 
            onClick={onConfirm} 
            className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
            disabled={!formData.startDate || (paymentMethod === 'upi' && !formData.upiId)}
          >
            Confirm Booking & Pay ₹{Math.round(totalAmount * 1.23)}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to our Terms & Conditions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
