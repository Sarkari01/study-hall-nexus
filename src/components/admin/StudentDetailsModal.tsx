
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, MapPin, Clock, DollarSign } from "lucide-react";

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  total_spent: number;
  total_bookings: number;
  average_session_duration: string;
  last_booking_date: string | null;
  preferred_study_halls: string[];
  created_at: string;
}

interface StudentDetailsModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  student,
  isOpen,
  onClose
}) => {
  if (!student) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold">{student.full_name}</h2>
              <p className="text-sm text-gray-500">ID: {student.student_id}</p>
            </div>
            <Badge className={getStatusColor(student.status)}>
              {student.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{student.phone}</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="text-lg font-medium mb-3">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="font-semibold">₹{student.total_spent.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="font-semibold">{student.total_bookings}</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Avg Session</p>
                <p className="font-semibold">{student.average_session_duration}</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Last Booking</p>
                <p className="font-semibold text-xs">
                  {student.last_booking_date 
                    ? new Date(student.last_booking_date).toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Preferred Study Halls */}
          {student.preferred_study_halls.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Preferred Study Halls</h3>
              <div className="flex flex-wrap gap-2">
                {student.preferred_study_halls.map((hall, index) => (
                  <Badge key={index} variant="outline">
                    {hall}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Account Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Account Information</h3>
            <div className="text-sm text-gray-600">
              <p>Created: {new Date(student.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Edit Student
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;
