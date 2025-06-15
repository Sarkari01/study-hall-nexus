
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Save, Eye, Edit3 } from "lucide-react";

interface SeatLayoutDesignerProps {
  rows: number;
  seatsPerRow: number;
  layout: string[];
  onLayoutChange: (layout: string[]) => void;
}

type SeatStatus = 'available' | 'occupied' | 'maintenance' | 'disabled';

interface Seat {
  id: string;
  status: SeatStatus;
  row: number;
  seat: number;
}

const SeatLayoutDesigner: React.FC<SeatLayoutDesignerProps> = ({
  rows,
  seatsPerRow,
  layout,
  onLayoutChange
}) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedTool, setSelectedTool] = useState<SeatStatus>('available');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Generate seat layout
  useEffect(() => {
    const newSeats: Seat[] = [];
    for (let r = 0; r < rows; r++) {
      for (let s = 0; s < seatsPerRow; s++) {
        const seatId = `${String.fromCharCode(65 + r)}${s + 1}`;
        newSeats.push({
          id: seatId,
          status: 'available',
          row: r,
          seat: s
        });
      }
    }
    setSeats(newSeats);
  }, [rows, seatsPerRow]);

  // Update layout when seats change
  useEffect(() => {
    const seatIds = seats
      .filter(seat => seat.status === 'available' || seat.status === 'occupied')
      .map(seat => seat.id);
    onLayoutChange(seatIds);
  }, [seats, onLayoutChange]);

  const handleSeatClick = (seatId: string) => {
    if (isPreviewMode) return;
    
    setSeats(prev => prev.map(seat => 
      seat.id === seatId 
        ? { ...seat, status: selectedTool }
        : seat
    ));
  };

  const resetLayout = () => {
    setSeats(prev => prev.map(seat => ({ ...seat, status: 'available' })));
  };

  const getSeatColor = (status: SeatStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'occupied':
        return 'bg-red-500 hover:bg-red-600';
      case 'maintenance':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'disabled':
        return 'bg-gray-400 hover:bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getToolColor = (status: SeatStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 text-white';
      case 'occupied':
        return 'bg-red-500 text-white';
      case 'maintenance':
        return 'bg-yellow-500 text-white';
      case 'disabled':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-300';
    }
  };

  const seatCounts = {
    available: seats.filter(s => s.status === 'available').length,
    occupied: seats.filter(s => s.status === 'occupied').length,
    maintenance: seats.filter(s => s.status === 'maintenance').length,
    disabled: seats.filter(s => s.status === 'disabled').length
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <span>Seat Layout Designer</span>
            <Badge variant="outline">{rows}×{seatsPerRow} Grid</Badge>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? <Edit3 className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="outline" size="sm" onClick={resetLayout}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seat Status Tools */}
        {!isPreviewMode && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Paint Tool:</span>
            {(['available', 'occupied', 'maintenance', 'disabled'] as SeatStatus[]).map(status => (
              <Button
                key={status}
                variant={selectedTool === status ? "default" : "outline"}
                size="sm"
                className={selectedTool === status ? getToolColor(status) : ''}
                onClick={() => setSelectedTool(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        )}

        {/* Layout Grid */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center mb-4">
            <div className="bg-gray-800 text-white py-2 px-4 rounded inline-block">
              📚 Front (Teacher/Screen Area)
            </div>
          </div>
          
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${seatsPerRow}, 1fr)` }}>
            {seats.map(seat => (
              <div
                key={seat.id}
                className={`
                  w-10 h-10 rounded-md border-2 border-white 
                  flex items-center justify-center text-xs font-medium text-white
                  transition-colors cursor-pointer
                  ${getSeatColor(seat.status)}
                  ${isPreviewMode ? 'cursor-default' : 'cursor-pointer'}
                `}
                onClick={() => handleSeatClick(seat.id)}
                title={`Seat ${seat.id} - ${seat.status}`}
              >
                {seat.id}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <div className="bg-gray-800 text-white py-2 px-4 rounded inline-block">
              🚪 Back (Entry/Exit)
            </div>
          </div>
        </div>

        {/* Seat Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-6 h-6 bg-green-500 rounded mx-auto mb-1"></div>
            <div className="text-sm font-medium">Available</div>
            <div className="text-lg font-bold">{seatCounts.available}</div>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 bg-red-500 rounded mx-auto mb-1"></div>
            <div className="text-sm font-medium">Occupied</div>
            <div className="text-lg font-bold">{seatCounts.occupied}</div>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 bg-yellow-500 rounded mx-auto mb-1"></div>
            <div className="text-sm font-medium">Maintenance</div>
            <div className="text-lg font-bold">{seatCounts.maintenance}</div>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 bg-gray-500 rounded mx-auto mb-1"></div>
            <div className="text-sm font-medium">Disabled</div>
            <div className="text-lg font-bold">{seatCounts.disabled}</div>
          </div>
        </div>

        {/* Instructions */}
        {!isPreviewMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <strong>Instructions:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Select a paint tool above and click on seats to change their status</li>
                <li><strong>Available:</strong> Seats that can be booked by students</li>
                <li><strong>Occupied:</strong> Currently booked seats (for preview)</li>
                <li><strong>Maintenance:</strong> Temporarily unavailable seats</li>
                <li><strong>Disabled:</strong> Permanently disabled seats (removed from layout)</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeatLayoutDesigner;
