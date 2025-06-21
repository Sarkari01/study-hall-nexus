import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface MobileSeatSelectionProps {
  studyHall: any;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
}

const MobileSeatSelection: React.FC<MobileSeatSelectionProps> = ({ 
  studyHall, 
  selectedSeats, 
  onSeatSelect 
}) => {
  const [showLegend, setShowLegend] = useState(true);

  // Generate seat layout optimized for mobile
  const generateSeatLayout = () => {
    const seats = [];
    const rows = 6;
    const seatsPerRow = 6; // Reduced for mobile screens
    
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`;
        const isOccupied = Math.random() > 0.7;
        rowSeats.push({
          id: seatId,
          status: isOccupied ? 'occupied' : 'available'
        });
      }
      seats.push(rowSeats);
    }
    return seats;
  };

  const seatLayout = generateSeatLayout();

  const getSeatClass = (seat: any) => {
    if (seat.status === 'occupied') {
      return 'bg-red-200 text-red-800 cursor-not-allowed border-red-300';
    }
    if (selectedSeats.includes(seat.id)) {
      return 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105';
    }
    return 'bg-green-100 text-green-800 hover:bg-green-200 active:scale-95 cursor-pointer border-green-300';
  };

  const handleSeatSelect = async (seat: any) => {
    if (seat.status === 'available') {
      // Add haptic feedback for mobile
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (error) {
        // Haptics not available, continue without
      }
      onSeatSelect(seat.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Legend Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Select Your Seats</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowLegend(!showLegend)}
        >
          {showLegend ? 'Hide' : 'Show'} Legend
        </Button>
      </div>

      {/* Legend */}
      {showLegend && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 border border-green-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 border border-blue-600 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-200 border border-red-300 rounded"></div>
                <span>Occupied</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Screen/Front indication */}
          <div className="text-center">
            <div className="bg-gray-800 text-white py-3 px-6 rounded-lg inline-block text-sm font-medium">
              📺 FRONT / SCREEN
            </div>
          </div>

          {/* Mobile-optimized Seat Grid */}
          <div className="space-y-2">
            {seatLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center items-center gap-2">
                <div className="flex items-center justify-center w-8 text-sm font-medium text-gray-500">
                  {String.fromCharCode(65 + rowIndex)}
                </div>
                <div className="flex gap-1">
                  {row.map((seat, seatIndex) => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatSelect(seat)}
                      disabled={seat.status === 'occupied'}
                      className={`
                        w-10 h-10 text-xs font-medium rounded-lg border-2 transition-all duration-200
                        ${getSeatClass(seat)}
                        touch-manipulation
                      `}
                      title={`Seat ${seat.id} - ${seat.status}`}
                    >
                      {seatIndex + 1}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Seats Summary */}
          {selectedSeats.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 font-medium mb-2">
                Selected Seats ({selectedSeats.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map(seat => (
                  <Badge 
                    key={seat} 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-800"
                  >
                    {seat}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileSeatSelection;
