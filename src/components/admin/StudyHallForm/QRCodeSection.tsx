
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { StudyHallFormData } from "@/hooks/useStudyHallForm";

interface QRCodeSectionProps {
  formData: StudyHallFormData;
  updateFormData: (updates: Partial<StudyHallFormData>) => void;
  onShowQRCode: () => void;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ formData, updateFormData, onShowQRCode }) => {
  const generateQRCode = () => {
    // Generate a proper booking URL with the study hall ID or a placeholder
    const studyHallId = formData.id || 'new-study-hall';
    const bookingUrl = `${window.location.origin}/book/${studyHallId}`;
    
    updateFormData({ qrCode: bookingUrl });
    onShowQRCode();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {formData.qrCode ? (
          <div className="text-center space-y-3">
            <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
              <QrCode className="h-16 w-16 text-gray-400" />
            </div>
            <div className="space-y-2">
              <Button variant="outline" size="sm" onClick={onShowQRCode}>
                View QR Code
              </Button>
              <p className="text-xs text-gray-500">Click to view the generated QR code</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Button onClick={generateQRCode} variant="outline" className="w-full">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
            <p className="text-xs text-gray-500 mt-2">Students can scan this to book directly</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeSection;
