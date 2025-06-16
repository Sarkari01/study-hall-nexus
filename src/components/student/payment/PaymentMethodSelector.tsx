
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: 'upi' | 'web' | 'qr';
  onMethodChange: (method: 'upi' | 'web' | 'qr') => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
            selectedMethod === 'qr' ? 'border-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => onMethodChange('qr')}
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
  );
};

export default PaymentMethodSelector;
