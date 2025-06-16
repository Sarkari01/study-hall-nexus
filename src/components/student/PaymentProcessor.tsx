
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Wallet, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentProcessorProps {
  totalAmount: number;
  bookingDetails: {
    studyHallName: string;
    selectedSeats: string[];
    bookingDate: string;
    startTime: string;
    endTime: string;
  };
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentCancel: () => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  totalAmount,
  bookingDetails,
  onPaymentSuccess,
  onPaymentCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('upi');
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const { toast } = useToast();

  const paymentMethods = [
    { 
      id: 'upi', 
      label: 'UPI Payment', 
      icon: Smartphone,
      description: 'Pay using Google Pay, PhonePe, Paytm',
      processingTime: 'Instant'
    },
    { 
      id: 'card', 
      label: 'Credit/Debit Card', 
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay accepted',
      processingTime: '2-3 minutes'
    },
    { 
      id: 'wallet', 
      label: 'StudySpace Wallet', 
      icon: Wallet,
      description: 'Use your wallet balance',
      processingTime: 'Instant'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateFees = () => {
    const subtotal = totalAmount;
    const serviceFee = Math.round(subtotal * 0.02); // 2% service fee
    const gst = Math.round((subtotal + serviceFee) * 0.18); // 18% GST
    const total = subtotal + serviceFee + gst;
    
    return { subtotal, serviceFee, gst, total };
  };

  const validatePaymentForm = () => {
    if (paymentMethod === 'upi' && !formData.upiId) {
      toast({
        title: "Validation Error",
        description: "Please enter your UPI ID",
        variant: "destructive"
      });
      return false;
    }
    
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.nameOnCard) {
        toast({
          title: "Validation Error",
          description: "Please fill in all card details",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };

  const processPayment = async () => {
    if (!validatePaymentForm()) return;
    
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock transaction ID
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate payment success
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        toast({
          title: "Payment Successful!",
          description: `Transaction ID: ${transactionId}`,
        });
        onPaymentSuccess(transactionId);
      } else {
        throw new Error("Payment failed. Please try again.");
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An error occurred during payment",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const fees = calculateFees();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-4 block">Select Payment Method</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as any)}
              className="space-y-3"
            >
              {paymentMethods.map((method) => (
                <div key={method.id} className="relative">
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={method.id}
                    className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-50"
                  >
                    <method.icon className="h-6 w-6 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-semibold">{method.label}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs text-gray-500">{method.processingTime}</span>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Payment Form Fields */}
          {paymentMethod === 'upi' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@paytm"
                  value={formData.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                />
              </div>
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
                  maxLength={19}
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
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    maxLength={4}
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
              <div className="flex justify-between items-center">
                <span className="font-medium">Available Balance:</span>
                <span className="text-lg font-bold text-green-600">₹2,450</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Wallet payments are instant and secure. No additional fees.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Summary & Payment */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{bookingDetails.studyHallName}</h3>
            <div className="text-sm text-gray-600 space-y-1 mt-2">
              <div>Date: {new Date(bookingDetails.bookingDate).toLocaleDateString()}</div>
              <div>Time: {bookingDetails.startTime} - {bookingDetails.endTime}</div>
              <div>Seats: {bookingDetails.selectedSeats.join(', ')}</div>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal ({bookingDetails.selectedSeats.length} seats)</span>
              <span>₹{fees.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Service Fee (2%)</span>
              <span>₹{fees.serviceFee}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>GST (18%)</span>
              <span>₹{fees.gst}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>₹{fees.total}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              onClick={processPayment}
              disabled={processing}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {processing ? 'Processing...' : `Pay ₹${fees.total}`}
            </Button>
            
            <Button 
              onClick={onPaymentCancel}
              variant="outline"
              className="w-full"
              disabled={processing}
            >
              Cancel
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
            <Shield className="h-3 w-3" />
            <span>Secured by 256-bit SSL encryption</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcessor;
