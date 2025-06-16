
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, CreditCard, CheckCircle } from "lucide-react";
import { useBookingFlow } from '@/hooks/useBookingFlow';

interface BookingWizardProps {
  studyHall: {
    id: string;
    name: string;
    location: string;
    price_per_day: number;
    capacity: number;
    amenities: string[];
  };
  onComplete?: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ studyHall, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    selectedSeats: [] as string[],
    paymentMethod: 'upi' as 'upi' | 'card' | 'wallet'
  });

  const { loading, createBooking, processPayment } = useBookingFlow();

  const steps = [
    { id: 1, title: 'Select Date & Time', icon: Calendar },
    { id: 2, title: 'Choose Seats', icon: Users },
    { id: 3, title: 'Payment', icon: CreditCard },
    { id: 4, title: 'Confirmation', icon: CheckCircle }
  ];

  const calculateTotalAmount = () => {
    return studyHall.price_per_day * bookingData.selectedSeats.length;
  };

  const handleNext = async () => {
    if (currentStep === 3) {
      // Process payment
      try {
        const booking = await createBooking({
          studyHallId: studyHall.id,
          bookingDate: bookingData.date,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          selectedSeats: bookingData.selectedSeats,
          totalAmount: calculateTotalAmount()
        });

        if (booking) {
          await processPayment({
            method: bookingData.paymentMethod,
            amount: calculateTotalAmount()
          });
          setCurrentStep(4);
        }
      } catch (error) {
        console.error('Booking failed:', error);
      }
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                className="w-full p-2 border rounded-lg"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Select Your Seats</h3>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: studyHall.capacity }, (_, i) => {
                const seatId = `A${String(i + 1).padStart(2, '0')}`;
                const isSelected = bookingData.selectedSeats.includes(seatId);
                return (
                  <button
                    key={seatId}
                    onClick={() => {
                      if (isSelected) {
                        setBookingData({
                          ...bookingData,
                          selectedSeats: bookingData.selectedSeats.filter(s => s !== seatId)
                        });
                      } else {
                        setBookingData({
                          ...bookingData,
                          selectedSeats: [...bookingData.selectedSeats, seatId]
                        });
                      }
                    }}
                    className={`
                      aspect-square text-xs font-medium rounded border-2 
                      ${isSelected 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }
                    `}
                  >
                    {seatId}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-600">
              Selected: {bookingData.selectedSeats.length} seats
            </p>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Payment Method</h3>
            <div className="space-y-2">
              {[
                { id: 'upi', label: 'UPI Payment' },
                { id: 'card', label: 'Credit/Debit Card' },
                { id: 'wallet', label: 'Digital Wallet' }
              ].map((method) => (
                <label key={method.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={bookingData.paymentMethod === method.id}
                    onChange={(e) => setBookingData({ 
                      ...bookingData, 
                      paymentMethod: e.target.value as any 
                    })}
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold">₹{calculateTotalAmount()}</span>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
            <p className="text-gray-600">
              Your booking has been successfully confirmed. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h4 className="font-medium mb-2">Booking Details:</h4>
              <p><strong>Study Hall:</strong> {studyHall.name}</p>
              <p><strong>Date:</strong> {bookingData.date}</p>
              <p><strong>Time:</strong> {bookingData.startTime} - {bookingData.endTime}</p>
              <p><strong>Seats:</strong> {bookingData.selectedSeats.join(', ')}</p>
              <p><strong>Total:</strong> ₹{calculateTotalAmount()}</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.date && bookingData.startTime && bookingData.endTime;
      case 2:
        return bookingData.selectedSeats.length > 0;
      case 3:
        return bookingData.paymentMethod;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Study Hall Info */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{studyHall.name}</h2>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{studyHall.location}</span>
              </div>
            </div>
            <Badge variant="outline">₹{studyHall.price_per_day}/day</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2
                ${isActive ? 'bg-blue-500 border-blue-500 text-white' :
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  'bg-white border-gray-300 text-gray-400'}
              `}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm ${isActive ? 'font-semibold' : 'text-gray-500'}`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-8 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className={currentStep === 4 ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              {loading ? 'Processing...' : 
               currentStep === 4 ? 'Done' :
               currentStep === 3 ? 'Pay Now' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingWizard;
