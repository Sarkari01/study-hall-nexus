
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, Smartphone, Building2, Wallet, Shield, ArrowLeft, Loader2 } from "lucide-react";
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
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const { toast } = useToast();

  const taxes = Math.round(totalAmount * 0.18);
  const processingFee = Math.round(totalAmount * 0.05);
  const finalAmount = totalAmount + taxes + processingFee;

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock payment gateway response
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In a real implementation, you would integrate with payment gateways like:
      // Razorpay, Stripe, PayU, etc.
      
      toast({
        title: "Payment Successful",
        description: `Payment of ₹${finalAmount} completed successfully`
      });
      
      onPaymentSuccess(transactionId);
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Failed",
        description: "Please try again or use a different payment method",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  maxLength={3}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>
        );
      
      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-16">
                <div className="text-center">
                  <div className="font-semibold">Google Pay</div>
                  <div className="text-xs text-gray-500">Tap to pay</div>
                </div>
              </Button>
              <Button variant="outline" className="h-16">
                <div className="text-center">
                  <div className="font-semibold">PhonePe</div>
                  <div className="text-xs text-gray-500">Quick pay</div>
                </div>
              </Button>
            </div>
          </div>
        );
      
      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Your Bank</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                  <Button key={bank} variant="outline" className="h-12">
                    {bank}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'wallet':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-16">
                <div className="text-center">
                  <div className="font-semibold">Paytm</div>
                  <div className="text-xs text-gray-500">Balance: ₹2,500</div>
                </div>
              </Button>
              <Button variant="outline" className="h-16">
                <div className="text-center">
                  <div className="font-semibold">Amazon Pay</div>
                  <div className="text-xs text-gray-500">Balance: ₹1,200</div>
                </div>
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Study Hall:</span>
            <span className="font-medium">{bookingDetails.studyHallName}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{bookingDetails.bookingDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span>{bookingDetails.startTime} - {bookingDetails.endTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Seats:</span>
            <span>{bookingDetails.selectedSeats.join(', ')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="upi" id="upi" />
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <Label htmlFor="upi" className="font-medium">UPI</Label>
                <p className="text-sm text-gray-500">Pay using Google Pay, PhonePe, Paytm</p>
              </div>
              <Badge variant="secondary">Recommended</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="card" id="card" />
              <CreditCard className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <Label htmlFor="card" className="font-medium">Credit/Debit Card</Label>
                <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="netbanking" id="netbanking" />
              <Building2 className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <Label htmlFor="netbanking" className="font-medium">Net Banking</Label>
                <p className="text-sm text-gray-500">All major banks supported</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="wallet" id="wallet" />
              <Wallet className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <Label htmlFor="wallet" className="font-medium">Wallet</Label>
                <p className="text-sm text-gray-500">Paytm, Amazon Pay</p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          {renderPaymentForm()}
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Base Amount ({bookingDetails.selectedSeats.length} seats)</span>
            <span>₹{totalAmount}</span>
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

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your payment is secured with 256-bit SSL encryption. We don't store your payment details.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onPaymentCancel} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handlePayment} 
          disabled={processing}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₹${finalAmount}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentProcessor;
