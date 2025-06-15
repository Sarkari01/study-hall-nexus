
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, CreditCard, Phone, Mail, User } from "lucide-react";

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  total_bookings: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_booking_date?: string;
  total_spent?: string;
  average_session_duration?: string;
  preferred_study_halls?: string[];
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Details
          </DialogTitle>
          <DialogDescription>
            Comprehensive information about {student.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-sm">{student.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Student ID</label>
                  <p className="text-sm">{student.student_id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div>
                    <Badge variant={student.status === 'active' ? 'default' : 'destructive'}>
                      {student.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Member Since</label>
                  <p className="text-sm">{new Date(student.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm">{student.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{student.total_bookings}</p>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                </div>
                <div className="text-center">
                  <CreditCard className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{student.total_spent || '₹0'}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className="text-center">
                  <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{student.average_session_duration || '0h'}</p>
                  <p className="text-sm text-gray-600">Avg. Session</p>
                </div>
                <div className="text-center">
                  <MapPin className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{student.preferred_study_halls?.length || 0}</p>
                  <p className="text-sm text-gray-600">Preferred Halls</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferred Study Halls */}
          {student.preferred_study_halls && student.preferred_study_halls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preferred Study Halls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.preferred_study_halls.map((hall, index) => (
                    <Badge key={index} variant="secondary">
                      {hall}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Membership Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Membership Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Booking</label>
                  <p className="text-sm">
                    {student.last_booking_date 
                      ? new Date(student.last_booking_date).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;
