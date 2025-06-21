
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import MobileSeatSelection from './MobileSeatSelection';
import { useCapacitor } from '@/hooks/useCapacitor';

interface MobileBookingFlowProps {
  studyHall: any;
  onComplete: (bookingData: any) => void;
}

const MobileBookingFlow: React.FC<MobileBookingFlowProps> = ({ studyHall, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingDetails, setBookingDetails] = useState<any>({});
  const { isNative } = useCapacitor();

  const steps = [
    { title: 'Select Date & Time', component: 'datetime' },
    { title: 'Choose Seats', component: 'seats' },
    { title: 'Review & Pay', component: 'payment' }
  ];

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete booking
      onComplete({
        ...bookingDetails,
        selectedSeats,
        studyHall
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Date/time validation would go here
      case 1: return selectedSeats.length > 0;
      case 2: return true; // Payment validation would go here
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Date and time selection component will go here</p>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium">Today, June 21, 2025</p>
                  <p className="text-sm text-gray-600">9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 1:
        return (
          <MobileSeatSelection
            studyHall={studyHall}
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
          />
        );
      
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Booking Summary</h4>
                  <p className="text-sm text-gray-600">Study Hall: {studyHall?.name || 'Premium Study Room'}</p>
                  <p className="text-sm text-gray-600">Seats: {selectedSeats.join(', ')}</p>
                  <p className="text-sm text-gray-600">Date: Today, June 21, 2025</p>
                  <p className="text-sm text-gray-600">Time: 9:00 AM - 6:00 PM</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-green-600">₹{selectedSeats.length * 50}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            disabled={currentStep === 0}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="font-semibold">{steps[currentStep].title}</h1>
            <p className="text-xs text-gray-500">Step {currentStep + 1} of {steps.length}</p>
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-blue-500 h-1 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {renderStepContent()}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button 
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full h-12 text-lg font-medium"
        >
          {currentStep === steps.length - 1 ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Complete Booking
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileBookingFlow;
