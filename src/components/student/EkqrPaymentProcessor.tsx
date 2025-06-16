
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ArrowLeft, Loader2 } from "lucide-react";
import { useEkqrPayment } from "@/hooks/useEkqrPayment";
import { useToast } from "@/hooks/use-toast";
import QRCode from 'qrcode';

import BookingSummaryCard from "./payment/BookingSummaryCard";
import PaymentMethodSelector from "./payment/PaymentMethodSelector";
import PriceBreakdown from "./payment/PriceBreakdown";
import PaymentStageRenderer from "./payment/PaymentStageRenderer";

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

      // Fix date format for EKQR API - use DD-MM-YYYY format with hyphens
      const now = new Date();
      const txnDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
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
            // Call the parent component's success handler
            setTimeout(() => {
              onPaymentSuccess(transactionId || order.orderId);
            }, 2000); // Short delay to show success message
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

  const handleRetry = () => {
    setPaymentStage('select');
    setErrorMessage('');
    setQrCodeDataURL('');
  };

  const canGoBack = paymentStage === 'select' || paymentStage === 'failed';
  const showPayButton = paymentStage === 'select';

  return (
    <div className="space-y-6">
      <BookingSummaryCard
        studyHallName={bookingDetails.studyHallName}
        bookingDate={bookingDetails.bookingDate}
        startTime={bookingDetails.startTime}
        endTime={bookingDetails.endTime}
        selectedSeats={bookingDetails.selectedSeats}
      />

      {paymentStage === 'select' ? (
        <div className="space-y-6">
          <PaymentMethodSelector
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
          />

          <PriceBreakdown
            baseAmount={totalAmount}
            taxes={taxes}
            processingFee={processingFee}
            finalAmount={finalAmount}
            seatCount={bookingDetails.selectedSeats.length}
          />
        </div>
      ) : (
        <PaymentStageRenderer
          paymentStage={paymentStage}
          qrCodeDataURL={qrCodeDataURL}
          finalAmount={finalAmount}
          errorMessage={errorMessage}
          onRetry={handleRetry}
        />
      )}

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
