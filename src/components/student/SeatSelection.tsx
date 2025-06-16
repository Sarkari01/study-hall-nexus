
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SeatSelectionProps {
  studyHall: any;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ studyHall, selectedSeats, onSeatSelect }) => {
  // Generate seat layout (6 rows x 8 seats = 48 seats)
  const generateSeatLayout = () => {
    const seats = [];
    const rows = 6;
    const seatsPerRow = 8;
    
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`;
        const isOccupied = Math.random() > 0.7; // Random occupied seats
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
      return 'bg-blue-500 text-white border-blue-600 shadow-md';
    }
    return 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer border-green-300';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Seats</CardTitle>
        <div className="flex gap-4 text-sm">
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
            <span>Occupied</span>
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
          {seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              <div className="flex items-center justify-center w-6 text-sm font-medium text-gray-500">
                {String.fromCharCode(65 + rowIndex)}
              </div>
              {row.map((seat, seatIndex) => (
                <button
                  key={seat.id}
                  onClick={() => seat.status === 'available' && onSeatSelect(seat.id)}
                  disabled={seat.status === 'occupied'}
                  className={`
                    w-8 h-8 text-xs font-medium rounded border-2 transition-all
                    ${getSeatClass(seat)}
                  `}
                  title={`Seat ${seat.id} - ${seat.status}`}
                >
                  {seatIndex + 1}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeatSelection;
