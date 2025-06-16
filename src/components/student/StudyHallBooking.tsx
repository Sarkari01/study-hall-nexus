
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, MapPin, Star, CreditCard } from "lucide-react";
import SeatSelection from "./SeatSelection";
import BookingForm from "./BookingForm";
import { useToast } from "@/hooks/use-toast";

interface StudyHallBookingProps {
  studyHall: any;
  isOpen: boolean;
  onClose: () => void;
}

const StudyHallBooking: React.FC<StudyHallBookingProps> = ({ studyHall, isOpen, onClose }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<'day' | 'week' | 'month'>('day');
  const [activeTab, setActiveTab] = useState('details');
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

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to proceed",
        variant: "destructive"
      });
      return;
    }

    // Simulate booking process
    toast({
      title: "Booking Confirmed!",
      description: `Successfully booked ${selectedSeats.length} seat(s) at ${studyHall.name}`
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{studyHall.name}</DialogTitle>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{studyHall.location}</span>
            <Star className="h-4 w-4 text-yellow-400 fill-current ml-2" />
            <span>{studyHall.rating || 0} ({studyHall.total_bookings || 0} reviews)</span>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="seats">Select Seats</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Pricing</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Daily Rate</span>
                      <span className="font-semibold">₹{studyHall.price_per_day}</span>
                    </div>
                    {studyHall.price_per_week && (
                      <div className="flex justify-between items-center">
                        <span>Weekly Rate</span>
                        <span className="font-semibold">₹{studyHall.price_per_week}</span>
                      </div>
                    )}
                    {studyHall.price_per_month && (
                      <div className="flex justify-between items-center">
                        <span>Monthly Rate</span>
                        <span className="font-semibold">₹{studyHall.price_per_month}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      Save up to 40% with weekly and monthly bookings!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setActiveTab('seats')} className="bg-blue-600 hover:bg-blue-700">
                Continue to Seat Selection
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="seats" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SeatSelection
                  studyHall={studyHall}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelection}
                />
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Booking Type</label>
                      <div className="flex gap-2 mt-2">
                        {(['day', 'week', 'month'] as const).map((type) => (
                          <Button
                            key={type}
                            variant={bookingType === type ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setBookingType(type)}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Selected Seats:</span>
                        <span>{selectedSeats.length}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Rate per seat:</span>
                        <span>₹{bookingType === 'day' ? studyHall.price_per_day : 
                                bookingType === 'week' ? (studyHall.price_per_week || studyHall.price_per_day * 7) : 
                                (studyHall.price_per_month || studyHall.price_per_day * 30)}</span>
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
            <BookingForm
              studyHall={studyHall}
              selectedSeats={selectedSeats}
              bookingType={bookingType}
              totalAmount={calculateTotal()}
              onConfirm={handleBooking}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StudyHallBooking;
