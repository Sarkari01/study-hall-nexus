
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, Clock, MapPin, Phone, Mail, User } from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  bookingsCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  lastBooking?: string;
  totalSpent?: string;
  averageSessionDuration?: string;
  preferredStudyHalls?: string[];
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
          <DialogTitle className="flex items-center gap-3">
            <User className="h-6 w-6" />
            Student Details: {student.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Name:</span>
                  <span>{student.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Phone:</span>
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Member Since:</span>
                  <span>{new Date(student.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge variant={student.status === 'active' ? 'default' : 'destructive'}>
                  {student.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Activity Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{student.bookingsCount}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{student.totalSpent || '₹0'}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{student.averageSessionDuration || '0h'}</div>
                  <div className="text-sm text-gray-600">Avg. Session</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferred Study Halls */}
          {student.preferredStudyHalls && student.preferredStudyHalls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Preferred Study Halls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.preferredStudyHalls.map((hall, index) => (
                    <Badge key={index} variant="outline">
                      {hall}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Last Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Last Booking:</span>
                <span>{student.lastBooking ? new Date(student.lastBooking).toLocaleDateString() : 'Never'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;
