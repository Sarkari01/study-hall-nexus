
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Building2, Wallet, Shield, ArrowLeft, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useEkqrPayment } from "@/hooks/useEkqrPayment";
import { useToast } from "@/hooks/use-toast";

interface EkqrPaymentProcessorProps {
  totalAmount: number;
  bookingDetails: {
    studyHallName: string;
    selectedSeats: string[];
    bookingDate: string;
    startTime: string;
    endTime: string;
    bookingId?: string;
  };
  customerDetails: {
    name: string;
    email: string;
    mobile: string;
    userId: string;
  };
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentCancel: () => void;
}

const EkqrPaymentProcessor: React.FC<EkqrPaymentProcessorProps> = ({
  totalAmount,
  bookingDetails,
  customerDetails,
  onPaymentSuccess,
  onPaymentCancel
}) => {
  const [paymentStage, setPaymentStage] = useState<'select' | 'processing' | 'pending' | 'completed' | 'failed'>('select');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'web'>('upi');
  const [orderData, setOrderData] = useState<any>(null);
  const { toast } = useToast();
  
  const { processing, createOrder, startStatusPolling, stopStatusPolling, openUpiApp } = useEkqrPayment();

  const taxes = Math.round(totalAmount * 0.18);
  const processingFee = Math.round(totalAmount * 0.05);
  const finalAmount = totalAmount + taxes + processingFee;

  useEffect(() => {
    return () => {
      stopStatusPolling();
    };
  }, [stopStatusPolling]);

  const handlePayment = async () => {
    try {
      setPaymentStage('processing');

      const paymentData = {
        amount: finalAmount,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerMobile: customerDetails.mobile,
        userId: customerDetails.userId
      };

      const bookingData = {
        bookingId: bookingDetails.bookingId || `temp_${Date.now()}`,
        studyHallName: bookingDetails.studyHallName
      };

      const order = await createOrder(paymentData, bookingData, false);
      
      if (!order) {
        setPaymentStage('failed');
        return;
      }

      setOrderData(order);
      setPaymentStage('pending');

      // Start polling for payment status
      const txnDate = new Date().toLocaleDateString('en-GB'); // DD-MM-YYYY format
      
      startStatusPolling(
        order.clientTxnId,
        txnDate,
        (status) => {
          if (status === 'completed') {
            setPaymentStage('completed');
            toast({
              title: "Payment Successful",
              description: `Payment of ₹${finalAmount} completed successfully`
            });
            onPaymentSuccess(order.orderId);
          } else if (status === 'failed') {
            setPaymentStage('failed');
            toast({
              title: "Payment Failed",
              description: "Payment was not completed. Please try again.",
              variant: "destructive"
            });
          } else if (status === 'timeout') {
            setPaymentStage('failed');
            toast({
              title: "Payment Timeout",
              description: "Payment verification timed out. Please check your payment status manually.",
              variant: "destructive"
            });
          }
        }
      );

      // If UPI method is selected and UPI intents are available, open the app
      if (selectedMethod === 'upi' && order.upiIntent) {
        // Try to open Google Pay first, then PhonePe, then others
        if (order.upiIntent.gpay_link) {
          openUpiApp(order.upiIntent.gpay_link);
        } else if (order.upiIntent.phonepe_link) {
          openUpiApp(order.upiIntent.phonepe_link);
        } else if (order.upiIntent.paytm_link) {
          openUpiApp(order.upiIntent.paytm_link);
        } else if (order.upiIntent.bhim_link) {
          openUpiApp(order.upiIntent.bhim_link);
        }
      }

    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStage('failed');
      toast({
        title: "Payment Failed",
        description: "Please try again or use a different payment method",
        variant: "destructive"
      });
    }
  };

  const handleWebPayment = () => {
    if (orderData?.paymentUrl) {
      window.open(orderData.paymentUrl, '_blank');
    }
  };

  const renderPaymentStage = () => {
    switch (paymentStage) {
      case 'processing':
        return (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-medium mb-2">Creating Payment Order...</h3>
            <p className="text-gray-600">Please wait while we set up your payment</p>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center py-8 space-y-6">
            <Clock className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <div>
              <h3 className="text-lg font-medium mb-2">Payment in Progress</h3>
              <p className="text-gray-600 mb-4">
                {selectedMethod === 'upi' 
                  ? "Complete the payment in your UPI app"
                  : "Complete the payment in the opened browser tab"
                }
              </p>
              
              {selectedMethod === 'web' && (
                <Button onClick={handleWebPayment} className="mb-4">
                  Open Payment Page
                </Button>
              )}

              {orderData?.upiIntent && selectedMethod === 'upi' && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-3">Or choose your preferred UPI app:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {orderData.upiIntent.gpay_link && (
                      <Button 
                        variant="outline" 
                        onClick={() => openUpiApp(orderData.upiIntent.gpay_link)}
                        className="h-12"
                      >
                        Google Pay
                      </Button>
                    )}
                    {orderData.upiIntent.phonepe_link && (
                      <Button 
                        variant="outline" 
                        onClick={() => openUpiApp(orderData.upiIntent.phonepe_link)}
                        className="h-12"
                      >
                        PhonePe
                      </Button>
                    )}
                    {orderData.upiIntent.paytm_link && (
                      <Button 
                        variant="outline" 
                        onClick={() => openUpiApp(orderData.upiIntent.paytm_link)}
                        className="h-12"
                      >
                        Paytm
                      </Button>
                    )}
                    {orderData.upiIntent.bhim_link && (
                      <Button 
                        variant="outline" 
                        onClick={() => openUpiApp(orderData.upiIntent.bhim_link)}
                        className="h-12"
                      >
                        BHIM
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'completed':
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-medium mb-2 text-green-700">Payment Successful!</h3>
            <p className="text-gray-600">Your booking has been confirmed</p>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium mb-2 text-red-700">Payment Failed</h3>
            <p className="text-gray-600 mb-4">Your payment could not be processed</p>
            <Button onClick={() => setPaymentStage('select')} variant="outline">
              Try Again
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedMethod === 'upi' ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedMethod('upi')}
                >
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium">UPI Apps</div>
                    <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
                
                <div 
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedMethod === 'web' ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedMethod('web')}
                >
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">All Payment Methods</div>
                    <p className="text-sm text-gray-500">Cards, Net Banking, Wallets & UPI</p>
                  </div>
                </div>
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
          </div>
        );
    }
  };

  const canGoBack = paymentStage === 'select' || paymentStage === 'failed';
  const showPayButton = paymentStage === 'select';

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

      {/* Payment Content */}
      {renderPaymentStage()}

      {/* Security Notice */}
      {paymentStage === 'select' && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your payment is secured with 256-bit SSL encryption. We don't store your payment details.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {canGoBack && (
          <Button variant="outline" onClick={onPaymentCancel} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        {showPayButton && (
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
        )}
      </div>
    </div>
  );
};

export default EkqrPaymentProcessor;
