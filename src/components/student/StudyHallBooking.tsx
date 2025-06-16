
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import BookingHeader from "./booking/BookingHeader";
import StudyHallInformation from "./booking/StudyHallInformation";
import BookingDetailsForm from "./booking/BookingDetailsForm";
import BookingSummaryCard from "./booking/BookingSummaryCard";
import AdvancedSeatSelection from "./AdvancedSeatSelection";
import EkqrPaymentProcessor from "./EkqrPaymentProcessor";
import BookingConfirmation from "./BookingConfirmation";

interface StudyHallBookingProps {
  studyHall: any;
  isOpen: boolean;
  onClose: () => void;
}

const StudyHallBooking: React.FC<StudyHallBookingProps> = ({ studyHall, isOpen, onClose }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('details');
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    startTime: '09:00',
    endTime: '17:00'
  });
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [tempBookingId, setTempBookingId] = useState<string>('');
  const { toast } = useToast();

  // Mock customer details - in real app, get from auth/profile
  const customerDetails = {
    name: 'Demo Student',
    email: 'student@demo.com',
    mobile: '9876543210',
    userId: 'demo-student-id'
  };

  const handleSeatSelection = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const calculateTotal = () => {
    const basePrice = studyHall.price_per_day;
    return basePrice * selectedSeats.length;
  };

  const handleFormChange = (field: string, value: string) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  const createBooking = async (transactionId: string) => {
    setProcessing(true);
    
    try {
      // First create the booking record
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          student_id: customerDetails.userId,
          study_hall_id: studyHall.id,
          booking_date: bookingForm.startDate,
          start_time: bookingForm.startTime,
          end_time: bookingForm.endTime,
          total_amount: calculateTotal(),
          final_amount: calculateTotal() * 1.23,
          status: 'confirmed',
          payment_status: 'completed'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create seat bookings
      const seatPromises = selectedSeats.map(seatId => 
        supabase
          .from('booking_seats')
          .insert({
            booking_id: booking.id,
            seat_id: seatId
          })
      );

      await Promise.all(seatPromises);

      setConfirmedBooking({
        bookingReference: booking.booking_reference,
        studyHallName: studyHall.name,
        location: studyHall.location,
        selectedSeats,
        bookingDate: bookingForm.startDate,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
        totalAmount: Math.round(calculateTotal() * 1.23),
        transactionId,
        status: 'confirmed'
      });

      setActiveTab('confirmation');
      
      toast({
        title: "Booking Confirmed!",
        description: `Successfully booked ${selectedSeats.length} seat(s) at ${studyHall.name}`
      });

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = (transactionId: string) => {
    createBooking(transactionId);
  };

  const handlePaymentCancel = () => {
    setActiveTab('seats');
  };

  const handleBookingComplete = () => {
    setSelectedSeats([]);
    setBookingForm({ startDate: '', startTime: '09:00', endTime: '17:00' });
    setConfirmedBooking(null);
    setTempBookingId('');
    setActiveTab('details');
    onClose();
  };

  const handleBack = () => {
    if (activeTab === 'payment') setActiveTab('seats');
    else if (activeTab === 'seats') setActiveTab('details');
  };

  const showBackButton = activeTab !== 'details' && activeTab !== 'confirmation';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <BookingHeader
            studyHall={studyHall}
            activeTab={activeTab}
            onBack={handleBack}
            showBackButton={showBackButton}
          />
        </DialogHeader>

        {confirmedBooking ? (
          <BookingConfirmation
            booking={confirmedBooking}
            onDownloadTicket={() => toast({ title: "Download", description: "Ticket download feature coming soon!" })}
            onShareBooking={() => toast({ title: "Share", description: "Share feature coming soon!" })}
            onViewQRCode={() => toast({ title: "QR Code", description: "QR code feature coming soon!" })}
            onClose={handleBookingComplete}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="seats" disabled={!bookingForm.startDate}>Select Seats</TabsTrigger>
              <TabsTrigger value="payment" disabled={selectedSeats.length === 0}>Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StudyHallInformation studyHall={studyHall} />
                <BookingDetailsForm
                  bookingForm={bookingForm}
                  onFormChange={handleFormChange}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setActiveTab('seats')} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!bookingForm.startDate}
                >
                  Continue to Seat Selection
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="seats" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AdvancedSeatSelection
                    studyHall={studyHall}
                    selectedSeats={selectedSeats}
                    onSeatSelect={handleSeatSelection}
                    bookingDate={bookingForm.startDate}
                    startTime={bookingForm.startTime}
                    endTime={bookingForm.endTime}
                  />
                </div>
                
                <BookingSummaryCard
                  selectedSeats={selectedSeats}
                  studyHall={studyHall}
                  calculateTotal={calculateTotal}
                  onProceedToPayment={() => setActiveTab('payment')}
                />
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <EkqrPaymentProcessor
                totalAmount={calculateTotal()}
                bookingDetails={{
                  studyHallName: studyHall.name,
                  selectedSeats,
                  bookingDate: bookingForm.startDate,
                  startTime: bookingForm.startTime,
                  endTime: bookingForm.endTime,
                  bookingId: tempBookingId
                }}
                customerDetails={customerDetails}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentCancel={handlePaymentCancel}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudyHallBooking;
