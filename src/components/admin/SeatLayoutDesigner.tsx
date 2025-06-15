
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";

interface SeatInfo {
  id: string;
  status: 'available' | 'occupied' | 'maintenance' | 'disabled';
}

interface SeatLayoutDesignerProps {
  rows: number;
  seatsPerRow: number;
  layout: SeatInfo[];
  onLayoutChange: (rows: number, seatsPerRow: number) => void;
  onSeatStatusChange: (seatId: string, status: SeatInfo['status']) => void;
}

const SeatLayoutDesigner: React.FC<SeatLayoutDesignerProps> = ({
  rows,
  seatsPerRow,
  layout,
  onLayoutChange,
  onSeatStatusChange
}) => {
  const seatColors = {
    available: 'bg-green-500 hover:bg-green-600 text-white',
    occupied: 'bg-red-500 hover:bg-red-600 text-white',
    maintenance: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    disabled: 'bg-gray-500 hover:bg-gray-600 text-white'
  };

  const statusLabels = {
    available: 'Available',
    occupied: 'Occupied',
    maintenance: 'Maintenance',
    disabled: 'Disabled'
  };

  const cycleStatus = (currentStatus: SeatInfo['status']): SeatInfo['status'] => {
    const statuses: SeatInfo['status'][] = ['available', 'occupied', 'maintenance', 'disabled'];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  const handleSeatClick = (seatId: string) => {
    const seat = layout.find(s => s.id === seatId);
    if (seat) {
      const newStatus = cycleStatus(seat.status);
      onSeatStatusChange(seatId, newStatus);
    }
  };

  const getTotalSeats = () => layout.filter(seat => seat.status !== 'disabled').length;
  const getAvailableSeats = () => layout.filter(seat => seat.status === 'available').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cabin Layout Designer</CardTitle>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{getTotalSeats()} Total Cabins</span>
          <span>{getAvailableSeats()} Available</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Layout Controls */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2">Rows: {rows}</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => rows > 1 && onLayoutChange(rows - 1, seatsPerRow)}
                disabled={rows <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{rows}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => rows < 10 && onLayoutChange(rows + 1, seatsPerRow)}
                disabled={rows >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Columns: {seatsPerRow}</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => seatsPerRow > 1 && onLayoutChange(rows, seatsPerRow - 1)}
                disabled={seatsPerRow <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{seatsPerRow}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => seatsPerRow < 12 && onLayoutChange(rows, seatsPerRow + 1)}
                disabled={seatsPerRow >= 12}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Cabin States Legend */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Cabin States</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(statusLabels).map(([status, label]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${seatColors[status as keyof typeof seatColors].split(' ')[0]}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Click on any cabin to cycle through states</p>
        </div>

        {/* Movie Theater Style Layout */}
        <div className="space-y-4">
          {/* Entrance */}
          <div className="text-center">
            <div className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium">
              ENTRANCE
            </div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-2">
            {Array.from({ length: rows }, (_, rowIndex) => {
              const rowLetter = String.fromCharCode(65 + rowIndex);
              return (
                <div key={rowLetter} className="flex items-center gap-2">
                  {/* Row Letter */}
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm font-medium">
                    {rowLetter}
                  </div>
                  
                  {/* Seats in Row */}
                  <div className="flex gap-1">
                    {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                      const seatId = `${rowLetter}${seatIndex + 1}`;
                      const seat = layout.find(s => s.id === seatId);
                      const status = seat?.status || 'available';
                      
                      return (
                        <Button
                          key={seatId}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSeatClick(seatId)}
                          className={`w-12 h-10 p-0 text-xs font-medium rounded transition-colors ${seatColors[status]}`}
                        >
                          {seatId}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column Numbers */}
          <div className="flex items-center gap-2 ml-10">
            {Array.from({ length: seatsPerRow }, (_, index) => (
              <div key={index + 1} className="w-12 text-center text-xs text-gray-500">
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {Object.entries(statusLabels).map(([status, label]) => {
            const count = layout.filter(seat => seat.status === status).length;
            return (
              <div key={status} className="p-2 bg-gray-50 rounded">
                <div className="font-medium">{count}</div>
                <div className="text-gray-600">{label}</div>
              </div>
            );
          })}
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Last saved: {new Date().toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeatLayoutDesigner;
