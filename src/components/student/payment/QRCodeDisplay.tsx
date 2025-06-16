
import React from 'react';
import { Clock } from "lucide-react";

interface QRCodeDisplayProps {
  qrCodeDataURL: string;
  finalAmount: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCodeDataURL,
  finalAmount
}) => {
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
};

export default QRCodeDisplay;
