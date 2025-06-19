
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeInput, validateBookingData } from '@/utils/inputValidation';
import SecureBookingForm from '@/components/security/SecureBookingForm';

interface StudyHall {
  id: string;
  name: string;
  location: string;
  price_per_day: number;
  capacity: number;
  amenities: string[];
  description?: string;
  merchant_name?: string;
}

interface BookingWizardProps {
  studyHall: StudyHall;
  onComplete: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ studyHall, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const steps = [
    { id: 1, title: 'Booking Details', icon: Calendar },
    { id: 2, title: 'Confirmation', icon: CheckCircle },
    { id: 3, title: 'Payment', icon: CreditCard },
    { id: 4, title: 'Complete', icon: CheckCircle }
  ];

  const handleBookingSubmit = async (data: any) => {
    // Validate and sanitize the booking data
    const validation = validateBookingData(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    setBookingData({
      ...data,
      study_hall_name: sanitizeInput(studyHall.name),
      study_hall_location: sanitizeInput(studyHall.location),
      price_per_day: studyHall.price_per_day
    });
    setCurrentStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!bookingData) return;

    setLoading(true);
    try {
      // First, create or get student record
      const { data: existingStudent, error: studentCheckError } = await supabase
        .from('students')
        .select('id')
        .eq('email', bookingData.student_email)
        .maybeSingle();

      if (studentCheckError) {
        console.error('Error checking student:', studentCheckError);
        throw new Error('Failed to process student information');
      }

      let studentId = existingStudent?.id;

      if (!studentId) {
        // Create new student record with sanitized data
        const { data: newStudent, error: studentError } = await supabase
          .from('students')
          .insert([{
            full_name: sanitizeInput(bookingData.student_name),
            email: bookingData.student_email.toLowerCase().trim(),
            phone: bookingData.student_phone.replace(/[^\d\s\-\(\)\+]/g, ''),
            status: 'active'
          }])
          .select('id')
          .single();

        if (studentError) {
          console.error('Error creating student:', studentError);
          throw new Error('Failed to create student record');
        }

        studentId = newStudent.id;
      }

      // Calculate total amount
      const totalAmount = studyHall.price_per_day;

      // Create booking with validated data
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          student_id: studentId,
          study_hall_id: studyHall.id,
          booking_date: bookingData.booking_date,
          start_time: bookingData.start_time,
          end_time: bookingData.end_time,
          total_amount: totalAmount,
          final_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        throw new Error('Failed to create booking');
      }

      setCurrentStep(3);
      
      toast({
        title: "Booking Created",
        description: "Your booking has been created successfully.",
      });

      // Simulate payment process
      setTimeout(() => {
        setCurrentStep(4);
        setTimeout(onComplete, 2000);
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Booking Details</h3>
              <p className="text-gray-600">Please provide your information and preferred time slot</p>
            </div>
            <SecureBookingForm
              studyHallId={studyHall.id}
              onSubmit={handleBookingSubmit}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Your Booking</h3>
              <p className="text-gray-600">Please review your booking details before proceeding</p>
            </div>
            
            {bookingData && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
                  <p className="text-sm text-gray-600">Name: {bookingData.student_name}</p>
                  <p className="text-sm text-gray-600">Email: {bookingData.student_email}</p>
                  <p className="text-sm text-gray-600">Phone: {bookingData.student_phone}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                  <p className="text-sm text-gray-600">Date: {bookingData.booking_date}</p>
                  <p className="text-sm text-gray-600">Time: {bookingData.start_time} - {bookingData.end_time}</p>
                  <p className="text-sm text-gray-600">Study Hall: {studyHall.name}</p>
                  <p className="text-sm text-gray-600">Location: {studyHall.location}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Payment Summary</h4>
                  <p className="text-lg font-semibold text-blue-900">Total: ₹{studyHall.price_per_day}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)} 
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleConfirmBooking} 
                disabled={loading} 
                className="flex-1"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-600">Please wait while we process your payment...</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600">Your booking has been successfully confirmed. You will receive a confirmation email shortly.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8 space-x-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${isActive ? 'border-blue-600 bg-blue-600 text-white' : 
                  isCompleted ? 'border-green-600 bg-green-600 text-white' : 
                  'border-gray-300 bg-white text-gray-400'}
              `}>
                <Icon className="h-5 w-5" />
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <Badge variant="outline" className="w-fit mx-auto mb-2">
            Step {currentStep} of {steps.length}
          </Badge>
          <CardTitle className="text-xl">{steps[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingWizard;
