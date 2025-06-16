
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SeatLayout {
  id: string;
  seat_id: string;
  row_number: number;
  seat_number: number;
  is_available: boolean;
  seat_type: string;
}

interface AdvancedSeatSelectionProps {
  studyHall: any;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  bookingDate: string;
  startTime: string;
  endTime: string;
}

const AdvancedSeatSelection: React.FC<AdvancedSeatSelectionProps> = ({
  studyHall,
  selectedSeats,
  onSeatSelect,
  bookingDate,
  startTime,
  endTime
}) => {
  const [seatLayout, setSeatLayout] = useState<SeatLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSeatLayout();
    fetchBookedSeats();
    
    // Set up real-time subscription for seat availability
    const subscription = supabase
      .channel('seat-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'seat_layouts',
        filter: `study_hall_id=eq.${studyHall.id}`
      }, (payload) => {
        console.log('Seat layout updated:', payload);
        fetchSeatLayout();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, (payload) => {
        console.log('Booking updated:', payload);
        fetchBookedSeats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [studyHall.id, bookingDate, startTime, endTime]);

  const fetchSeatLayout = async () => {
    try {
      const { data, error } = await supabase
        .from('seat_layouts')
        .select('*')
        .eq('study_hall_id', studyHall.id)
        .order('row_number')
        .order('seat_number');

      if (error) throw error;
      setSeatLayout(data || []);
    } catch (error) {
      console.error('Error fetching seat layout:', error);
      toast({
        title: "Error",
        description: "Failed to load seat layout",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSeats = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          booking_seats!inner(seat_id)
        `)
        .eq('study_hall_id', studyHall.id)
        .eq('booking_date', bookingDate)
        .eq('status', 'confirmed')
        .lte('start_time', endTime)
        .gte('end_time', startTime);

      if (error) throw error;
      
      const bookedSeatIds = data?.flatMap(booking => 
        booking.booking_seats.map(seat => seat.seat_id)
      ) || [];
      
      setBookedSeats(bookedSeatIds);
    } catch (error) {
      console.error('Error fetching booked seats:', error);
    }
  };

  const getSeatClass = (seat: SeatLayout) => {
    if (!seat.is_available || bookedSeats.includes(seat.seat_id)) {
      return 'bg-red-200 text-red-800 cursor-not-allowed border-red-300';
    }
    if (selectedSeats.includes(seat.seat_id)) {
      return 'bg-blue-500 text-white border-blue-600 shadow-md';
    }
    return 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer border-green-300 transition-colors';
  };

  const getSeatStatus = (seat: SeatLayout) => {
    if (!seat.is_available) return 'maintenance';
    if (bookedSeats.includes(seat.seat_id)) return 'booked';
    if (selectedSeats.includes(seat.seat_id)) return 'selected';
    return 'available';
  };

  const handleSeatClick = (seat: SeatLayout) => {
    const isAvailable = seat.is_available && !bookedSeats.includes(seat.seat_id);
    if (isAvailable) {
      onSeatSelect(seat.seat_id);
    }
  };

  // Group seats by row
  const seatsByRow = seatLayout.reduce((acc, seat) => {
    if (!acc[seat.row_number]) {
      acc[seat.row_number] = [];
    }
    acc[seat.row_number].push(seat);
    return acc;
  }, {} as Record<number, SeatLayout[]>);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Seat Layout...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Seats</CardTitle>
        <div className="flex gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
            <span>Booked/Unavailable</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Screen/Front indication */}
        <div className="text-center">
          <div className="bg-gray-200 text-gray-600 py-2 px-4 rounded-lg inline-block text-sm font-medium">
            📺 FRONT / SCREEN
          </div>
        </div>

        {/* Seat Grid */}
        <div className="space-y-3">
          {Object.keys(seatsByRow)
            .sort((a, b) => Number(a) - Number(b))
            .map((rowNumber) => (
              <div key={rowNumber} className="flex justify-center gap-2 items-center">
                <div className="flex items-center justify-center w-6 text-sm font-medium text-gray-500 mr-2">
                  {String.fromCharCode(64 + Number(rowNumber))}
                </div>
                {seatsByRow[Number(rowNumber)]
                  .sort((a, b) => a.seat_number - b.seat_number)
                  .map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={!seat.is_available || bookedSeats.includes(seat.seat_id)}
                      className={`
                        w-8 h-8 text-xs font-medium rounded border-2 transition-all
                        ${getSeatClass(seat)}
                      `}
                      title={`Seat ${seat.seat_id} - ${getSeatStatus(seat)}`}
                    >
                      {seat.seat_number}
                    </button>
                  ))}
              </div>
            ))}
        </div>

        {/* Seat numbers legend */}
        <div className="flex justify-center mt-4">
          <div className="flex gap-2 text-xs text-gray-500">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="w-8 text-center">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">
              Selected Seats: {selectedSeats.join(', ')}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Real-time availability • Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSeatSelection;
