
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Calendar, Clock, MapPin, Users, Download, Share2, QrCode } from "lucide-react";

interface BookingConfirmationProps {
  booking: {
    bookingReference: string;
    studyHallName: string;
    location: string;
    selectedSeats: string[];
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalAmount: number;
    transactionId: string;
    status: string;
  };
  onDownloadTicket: () => void;
  onShareBooking: () => void;
  onViewQRCode: () => void;
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onDownloadTicket,
  onShareBooking,
  onViewQRCode,
  onClose
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-800">Booking Confirmed!</h2>
              <p className="text-green-700 mt-2">
                Your study hall has been successfully reserved
              </p>
            </div>
            <Badge variant="outline" className="text-green-700 border-green-300">
              Booking ID: {booking.bookingReference}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{booking.studyHallName}</h3>
                <div className="flex items-center gap-1 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{booking.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-gray-600">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Seats Reserved</p>
                  <p className="text-sm text-gray-600">
                    {booking.selectedSeats.join(', ')} ({booking.selectedSeats.length} seats)
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium">Payment Status</p>
                <Badge variant="outline" className="text-green-700 border-green-300 mt-1">
                  ✓ Paid
                </Badge>
              </div>

              <div>
                <p className="font-medium">Transaction ID</p>
                <p className="text-sm text-gray-600 font-mono">{booking.transactionId}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount Paid</span>
            <span className="text-xl font-bold text-green-600">₹{booking.totalAmount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-700">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Please arrive 10 minutes before your booking time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Show your QR code at the reception for check-in</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Cancellation allowed up to 2 hours before booking time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Please maintain silence and follow study hall guidelines</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button onClick={onViewQRCode} variant="outline" className="flex-col h-16">
          <QrCode className="h-5 w-5 mb-1" />
          <span className="text-xs">QR Code</span>
        </Button>
        
        <Button onClick={onDownloadTicket} variant="outline" className="flex-col h-16">
          <Download className="h-5 w-5 mb-1" />
          <span className="text-xs">Download</span>
        </Button>
        
        <Button onClick={onShareBooking} variant="outline" className="flex-col h-16">
          <Share2 className="h-5 w-5 mb-1" />
          <span className="text-xs">Share</span>
        </Button>
        
        <Button onClick={onClose} className="flex-col h-16 bg-blue-600 hover:bg-blue-700">
          <CheckCircle className="h-5 w-5 mb-1" />
          <span className="text-xs">Done</span>
        </Button>
      </div>

      {/* Support Contact */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-600">
            <p>Need help? Contact our support team</p>
            <p className="font-medium text-blue-600">support@studyspace.com | +91-9876543210</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
