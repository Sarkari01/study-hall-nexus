
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, ArrowLeft, Loader2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BookingWizard from '@/components/booking/BookingWizard';
import { CSRFProvider } from '@/components/security/CSRFProtection';
import { validateStudyHallId, rateLimiter } from '@/utils/inputValidation';

interface StudyHall {
  id: string;
  name: string;
  location: string;
  price_per_day: number;
  capacity: number;
  amenities: string[];
  description?: string;
  merchant_name?: string;
}

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studyHall, setStudyHall] = useState<StudyHall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudyHall = async () => {
      if (!id) {
        setError('Study hall ID is required');
        setLoading(false);
        return;
      }

      // Validate study hall ID format
      if (!validateStudyHallId(id)) {
        setError('Invalid study hall ID format');
        setLoading(false);
        return;
      }

      // Rate limiting for API calls
      const clientId = `booking-${navigator.userAgent}`;
      if (!rateLimiter.isAllowed(clientId, 10, 60000)) {
        setError('Too many requests. Please try again later.');
        setLoading(false);
        return;
      }

      try {
        // First fetch the study hall
        const { data: studyHallData, error: studyHallError } = await supabase
          .from('study_halls')
          .select(`
            id,
            name,
            location,
            price_per_day,
            capacity,
            amenities,
            description,
            merchant_id
          `)
          .eq('id', id)
          .eq('status', 'active')
          .single();

        if (studyHallError) {
          console.error('Error fetching study hall:', studyHallError);
          setError('Study hall not found or is not available for booking');
          return;
        }

        let merchantName = undefined;

        // If there's a merchant_id, fetch the merchant details
        if (studyHallData.merchant_id) {
          const { data: merchantData, error: merchantError } = await supabase
            .from('merchant_profiles')
            .select('business_name')
            .eq('id', studyHallData.merchant_id)
            .single();

          if (!merchantError && merchantData) {
            merchantName = merchantData.business_name;
          }
        }

        setStudyHall({
          id: studyHallData.id,
          name: studyHallData.name,
          location: studyHallData.location,
          price_per_day: studyHallData.price_per_day,
          capacity: studyHallData.capacity,
          amenities: studyHallData.amenities || [],
          description: studyHallData.description,
          merchant_name: merchantName
        });
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load study hall details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudyHall();
  }, [id]);

  const handleBookingComplete = () => {
    toast({
      title: "Booking Completed!",
      description: "Your booking has been successfully confirmed.",
    });
    // Navigate to a thank you page or back to home
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading study hall details...</p>
        </div>
      </div>
    );
  }

  if (error || !studyHall) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="text-red-500 text-6xl mb-4">📍</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Study Hall Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'The study hall you\'re looking for is not available or may have been removed.'}
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CSRFProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Book Your Seat</h1>
                  <p className="text-sm text-gray-500">Complete your booking in a few simple steps</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Secure Booking
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Study Hall Info Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{studyHall.name}</h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{studyHall.location}</span>
                  {studyHall.merchant_name && (
                    <>
                      <span className="mx-2">•</span>
                      <span>by {studyHall.merchant_name}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">₹{studyHall.price_per_day}</div>
                <div className="text-sm text-gray-500">per day</div>
              </div>
            </div>

            {studyHall.description && (
              <p className="mt-4 text-gray-700">{studyHall.description}</p>
            )}

            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>Capacity: {studyHall.capacity} seats</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Available for booking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Wizard */}
        <div className="py-8">
          <BookingWizard 
            studyHall={studyHall} 
            onComplete={handleBookingComplete}
          />
        </div>
      </div>
    </CSRFProvider>
  );
};

export default BookingPage;
