
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCodeLib from 'qrcode';

interface QRCodeDisplayProps {
  qrCode: string;
  studyHallName: string;
  onClose: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCode,
  studyHallName,
  onClose
}) => {
  const { toast } = useToast();
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Generate QR code image when component mounts
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true);
        const qrDataURL = await QRCodeLib.toDataURL(qrCode, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataURL(qrDataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
        toast({
          title: "QR Code Error",
          description: "Failed to generate QR code image",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (qrCode) {
      generateQRCode();
    }
  }, [qrCode, toast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCode);
    toast({
      title: "Copied!",
      description: "Booking link copied to clipboard",
    });
  };

  const downloadQR = () => {
    if (!qrCodeDataURL) {
      toast({
        title: "Error",
        description: "QR code not ready for download",
        variant: "destructive"
      });
      return;
    }

    const link = document.createElement('a');
    link.download = `${studyHallName.replace(/\s+/g, '-')}-qr-code.png`;
    link.href = qrCodeDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "QR code image downloaded successfully",
    });
  };

  const openBookingPage = () => {
    window.open(qrCode, '_blank');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code for {studyHallName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
              {loading ? (
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto" />
                  <p className="text-xs text-gray-500">Generating QR Code...</p>
                </div>
              ) : qrCodeDataURL ? (
                <img 
                  src={qrCodeDataURL} 
                  alt="QR Code for booking" 
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-center space-y-2">
                  <QrCode className="h-24 w-24 text-gray-600 mx-auto" />
                  <p className="text-xs text-gray-500">QR Code Preview</p>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="text-xs">
              Scan to Book Instantly
            </Badge>
            <p className="text-sm text-gray-600">
              Students can scan this QR code with their phone to access the booking page directly
            </p>
          </div>

          {/* Booking Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Booking Link:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={qrCode}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={downloadQR} 
              className="w-full"
              disabled={loading || !qrCodeDataURL}
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR
            </Button>
            <Button onClick={openBookingPage} className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Test Booking Page
            </Button>
          </div>

          {/* Usage Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-sm text-blue-900">How to use:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Print the QR code and display it at your study hall</li>
              <li>• Students scan with their phone camera</li>
              <li>• They'll be taken directly to the booking page</li>
              <li>• No app download required!</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDisplay;
