
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Users, MapPin, Star, CreditCard, ArrowLeft } from "lucide-react";
import AdvancedSeatSelection from "./AdvancedSeatSelection";
import PaymentProcessor from "./PaymentProcessor";
import BookingConfirmation from "./BookingConfirmation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StudyHallBookingProps {
  studyHall: any;
  isOpen: boolean;
  onClose: () => void;
}

const StudyHallBooking: React.FC<StudyHallBookingProps> = ({ studyHall, isOpen, onClose }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<'day' | 'week' | 'month'>('day');
  const [activeTab, setActiveTab] = useState('details');
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    startTime: '09:00',
    endTime: '17:00'
  });
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleSeatSelection = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const calculateTotal = () => {
    const basePrice = bookingType === 'day' ? studyHall.price_per_day :
                     bookingType === 'week' ? studyHall.price_per_week || studyHall.price_per_day * 7 :
                     studyHall.price_per_month || studyHall.price_per_day * 30;
    return basePrice * selectedSeats.length;
  };

  const handleFormChange = (field: string, value: string) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  const createBooking = async (transactionId: string) => {
    setProcessing(true);
    
    try {
      // Create the main booking record
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          student_id: (await supabase.auth.getUser()).data.user?.id,
          study_hall_id: studyHall.id,
          booking_date: bookingForm.startDate,
          start_time: bookingForm.startTime,
          end_time: bookingForm.endTime,
          total_amount: calculateTotal(),
          final_amount: calculateTotal() * 1.23, // Including taxes
          status: 'confirmed',
          payment_status: 'completed'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create booking seats records
      const seatPromises = selectedSeats.map(seatId => 
        supabase
          .from('booking_seats')
          .insert({
            booking_id: booking.id,
            seat_id: seatId
          })
      );

      await Promise.all(seatPromises);

      // Create payment transaction record
      await supabase
        .from('payment_transactions')
        .insert({
          booking_id: booking.id,
          amount: calculateTotal() * 1.23,
          payment_method: 'upi', // This would come from payment processor
          payment_status: 'completed',
          gateway_transaction_id: transactionId
        });

      // Set confirmed booking for display
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
    setActiveTab('details');
    onClose();
  };

  const resetBooking = () => {
    setSelectedSeats([]);
    setActiveTab('details');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            {activeTab !== 'details' && activeTab !== 'confirmation' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (activeTab === 'payment') setActiveTab('seats');
                  else if (activeTab === 'seats') setActiveTab('details');
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <DialogTitle className="text-2xl">{studyHall.name}</DialogTitle>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{studyHall.location}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current ml-2" />
                <span>{studyHall.rating || 0} ({studyHall.total_bookings || 0} reviews)</span>
              </div>
            </div>
          </div>
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
                {/* Study Hall Information */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Study Hall Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>Capacity: {studyHall.capacity} seats</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Hours: 24/7</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {studyHall.amenities?.map((amenity: string) => (
                          <Badge key={amenity} variant="outline">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {studyHall.description && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-gray-600">{studyHall.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Booking Form */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Booking Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="startDate">Booking Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={bookingForm.startDate}
                          onChange={(e) => handleFormChange('startDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={bookingForm.startTime}
                            onChange={(e) => handleFormChange('startTime', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={bookingForm.endTime}
                            onChange={(e) => handleFormChange('endTime', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          💡 Book for longer durations to get better rates!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-sm">
                          <span>Selected Seats:</span>
                          <span>{selectedSeats.length}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Rate per seat:</span>
                          <span>₹{studyHall.price_per_day}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t">
                          <span>Total:</span>
                          <span>₹{calculateTotal()}</span>
                        </div>
                      </div>

                      {selectedSeats.length > 0 && (
                        <Button 
                          onClick={() => setActiveTab('payment')} 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Proceed to Payment
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <PaymentProcessor
                totalAmount={calculateTotal()}
                bookingDetails={{
                  studyHallName: studyHall.name,
                  selectedSeats,
                  bookingDate: bookingForm.startDate,
                  startTime: bookingForm.startTime,
                  endTime: bookingForm.endTime
                }}
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
