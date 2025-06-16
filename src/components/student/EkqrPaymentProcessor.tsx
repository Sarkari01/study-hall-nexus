import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Shield, ArrowLeft, Loader2, CheckCircle, XCircle, Clock, QrCode } from "lucide-react";
import { useEkqrPayment } from "@/hooks/useEkqrPayment";
import { useToast } from "@/hooks/use-toast";
import QRCode from 'qrcode';

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
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'web' | 'qr'>('qr');
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const { toast } = useToast();
  
  const { processing, createOrder, startStatusPolling, stopStatusPolling } = useEkqrPayment();

  const taxes = Math.round(totalAmount * 0.18);
  const processingFee = Math.round(totalAmount * 0.05);
  const finalAmount = totalAmount + taxes + processingFee;

  useEffect(() => {
    return () => {
      stopStatusPolling();
    };
  }, [stopStatusPolling]);

  const generateQRCode = async (upiString: string) => {
    try {
      console.log('Generating QR code for UPI string:', upiString);
      const qrDataURL = await QRCode.toDataURL(upiString, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataURL(qrDataURL);
      return qrDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "QR Code Error",
        description: "Failed to generate QR code. Please try another payment method.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handlePayment = async () => {
    try {
      console.log('Starting payment process with final amount:', finalAmount);
      setPaymentStage('processing');
      setErrorMessage('');

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

      console.log('Creating EKQR order with data:', { paymentData, bookingData });
      const order = await createOrder(paymentData, bookingData, false);
      
      if (!order) {
        console.error('Failed to create EKQR order');
        setPaymentStage('failed');
        setErrorMessage('Failed to create payment order. Please try again.');
        return;
      }

      console.log('EKQR order created successfully:', order);
      setOrderData(order);
      setPaymentStage('pending');

      // Generate QR code for direct scanning
      if (order.upiIntent) {
        const upiLinks = [
          order.upiIntent.phonepe_link,
          order.upiIntent.gpay_link,
          order.upiIntent.paytm_link,
          order.upiIntent.bhim_link
        ].filter(Boolean);
        
        if (upiLinks.length > 0) {
          const upiLink = upiLinks[0];
          console.log('UPI link for QR:', upiLink);
          await generateQRCode(upiLink);
        }
      }

      // Start polling for payment status with current date in DD/MM/YYYY format
      const now = new Date();
      const txnDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      console.log('Starting status polling for transaction:', order.clientTxnId, 'on date:', txnDate);
      
      startStatusPolling(
        order.clientTxnId,
        txnDate,
        (status, transactionId) => {
          console.log('Payment status update received:', status, 'Transaction ID:', transactionId);
          if (status === 'completed') {
            setPaymentStage('completed');
            toast({
              title: "Payment Successful",
              description: `Payment of ₹${finalAmount} completed successfully`
            });
            // Pass the transaction ID to trigger booking creation
            onPaymentSuccess(transactionId || order.orderId);
          } else if (status === 'failed') {
            setPaymentStage('failed');
            setErrorMessage('Payment was not completed. Please try again.');
            toast({
              title: "Payment Failed",
              description: "Payment was not completed. Please try again.",
              variant: "destructive"
            });
          } else if (status === 'timeout') {
            setPaymentStage('failed');
            setErrorMessage('Payment verification timed out. Please check your payment status manually.');
            toast({
              title: "Payment Timeout",
              description: "Payment verification timed out. Please check your payment status manually.",
              variant: "destructive"
            });
          }
        }
      );

    } catch (error) {
      console.error('Payment failed:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setPaymentStage('failed');
      setErrorMessage(errorMsg);
      
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    }
  };

  const handleWebPayment = () => {
    if (orderData?.paymentUrl) {
      console.log('Opening web payment URL:', orderData.paymentUrl);
      window.open(orderData.paymentUrl, '_blank');
    }
  };

  const renderPaymentStage = () => {
    switch (paymentStage) {
      case 'processing':
        return (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-medium mb-2">Processing Payment...</h3>
            <p className="text-gray-600">Please wait while we process your payment</p>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center py-8 space-y-6">
            <Clock className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <div>
              <h3 className="text-lg font-medium mb-2">Scan QR Code to Pay</h3>
              <p className="text-gray-600 mb-4">
                Open PhonePe and scan the QR code below to complete your payment
              </p>

              {qrCodeDataURL && (
                <div className="mb-4">
                  <div className="w-64 h-64 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center p-4">
                    <img 
                      src={qrCodeDataURL} 
                      alt="Payment QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Scan with PhonePe to pay ₹{finalAmount}</p>
                  <p className="text-xs text-gray-400 mt-1">Payment will be detected automatically after scanning</p>
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
            <p className="text-gray-600">Your booking is being processed...</p>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium mb-2 text-red-700">Payment Failed</h3>
            <p className="text-gray-600 mb-4">{errorMessage || 'Your payment could not be processed'}</p>
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
                    selectedMethod === 'qr' ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedMethod('qr')}
                >
                  <QrCode className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-medium">QR Code Payment</div>
                    <p className="text-sm text-gray-500">Scan with PhonePe or any UPI app</p>
                  </div>
                  <Badge variant="secondary">Recommended</Badge>
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
              `Generate QR Code - ₹${finalAmount}`
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EkqrPaymentProcessor;
