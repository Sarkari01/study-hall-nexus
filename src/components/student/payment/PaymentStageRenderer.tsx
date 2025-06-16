
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import QRCodeDisplay from "./QRCodeDisplay";

interface PaymentStageRendererProps {
  paymentStage: 'select' | 'processing' | 'pending' | 'completed' | 'failed';
  qrCodeDataURL: string;
  finalAmount: number;
  errorMessage: string;
  onRetry: () => void;
}

const PaymentStageRenderer: React.FC<PaymentStageRendererProps> = ({
  paymentStage,
  qrCodeDataURL,
  finalAmount,
  errorMessage,
  onRetry
}) => {
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
        <QRCodeDisplay 
          qrCodeDataURL={qrCodeDataURL}
          finalAmount={finalAmount}
        />
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
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        </div>
      );

    default:
      return null;
  }
};

export default PaymentStageRenderer;
