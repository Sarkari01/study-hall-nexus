
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { sanitizeInput, validateBookingData, rateLimiter } from '@/utils/inputValidation';
import { useCSRF } from './CSRFProtection';

interface SecureBookingFormProps {
  studyHallId: string;
  onSubmit: (data: any) => Promise<void>;
}

const SecureBookingForm: React.FC<SecureBookingFormProps> = ({ studyHallId, onSubmit }) => {
  const [formData, setFormData] = useState({
    booking_date: '',
    start_time: '',
    end_time: '',
    student_name: '',
    student_email: '',
    student_phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { getHeaders } = useCSRF();

  const handleInputChange = (field: string, value: string) => {
    let sanitizedValue = value;
    
    switch (field) {
      case 'student_name':
        sanitizedValue = sanitizeInput(value);
        break;
      case 'student_email':
        sanitizedValue = value.toLowerCase().trim();
        break;
      case 'student_phone':
        sanitizedValue = value.replace(/[^\d\s\-\(\)\+]/g, '');
        break;
      default:
        sanitizedValue = sanitizeInput(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const clientId = `${navigator.userAgent}-${Date.now()}`;
    if (!rateLimiter.isAllowed(clientId, 3, 60000)) {
      toast({
        title: "Too many requests",
        description: "Please wait before submitting again.",
        variant: "destructive"
      });
      return;
    }

    const bookingData = {
      ...formData,
      study_hall_id: studyHallId
    };

    // Validate booking data
    const validation = validateBookingData(bookingData);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...bookingData,
        _headers: getHeaders() // Include CSRF headers
      });
      
      toast({
        title: "Booking Submitted",
        description: "Your booking request has been submitted successfully.",
      });
      
      // Reset form
      setFormData({
        booking_date: '',
        start_time: '',
        end_time: '',
        student_name: '',
        student_email: '',
        student_phone: ''
      });
    } catch (error) {
      console.error('Booking submission error:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="student_name">Full Name</Label>
        <Input
          id="student_name"
          type="text"
          value={formData.student_name}
          onChange={(e) => handleInputChange('student_name', e.target.value)}
          placeholder="Enter your full name"
          required
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="student_email">Email</Label>
        <Input
          id="student_email"
          type="email"
          value={formData.student_email}
          onChange={(e) => handleInputChange('student_email', e.target.value)}
          placeholder="Enter your email"
          required
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="student_phone">Phone Number</Label>
        <Input
          id="student_phone"
          type="tel"
          value={formData.student_phone}
          onChange={(e) => handleInputChange('student_phone', e.target.value)}
          placeholder="Enter your phone number"
          required
          maxLength={20}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking_date">Booking Date</Label>
        <Input
          id="booking_date"
          type="date"
          value={formData.booking_date}
          onChange={(e) => handleInputChange('booking_date', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => handleInputChange('start_time', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => handleInputChange('end_time', e.target.value)}
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Booking'}
      </Button>
    </form>
  );
};

export default SecureBookingForm;
