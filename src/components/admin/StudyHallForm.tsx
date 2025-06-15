
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useStudyHallForm, StudyHallFormData } from "@/hooks/useStudyHallForm";
import SeatLayoutDesigner from './SeatLayoutDesigner';
import QRCodeDisplay from './QRCodeDisplay';
import GoogleMapsLocationPicker from './GoogleMapsLocationPicker';
import BasicInformation from './StudyHallForm/BasicInformation';
import PricingSection from './StudyHallForm/PricingSection';
import AmenitiesSection from './StudyHallForm/AmenitiesSection';
import StatusSection from './StudyHallForm/StatusSection';
import ImageUploadSection from './StudyHallForm/ImageUploadSection';
import QRCodeSection from './StudyHallForm/QRCodeSection';

interface StudyHallFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudyHallFormData) => void;
  editData?: StudyHallFormData | null;
  isAdmin?: boolean;
  currentMerchant?: { id: number; name: string; businessName: string };
}

const StudyHallForm: React.FC<StudyHallFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
  isAdmin = true,
  currentMerchant
}) => {
  const {
    formData,
    merchants,
    loadingMerchants,
    newAmenity,
    setNewAmenity,
    showQRCode,
    setShowQRCode,
    showLocationPicker,
    setShowLocationPicker,
    handleLayoutChange,
    handleSeatStatusChange,
    updateFormData,
    toast
  } = useStudyHallForm({ editData, isAdmin, currentMerchant });

  const handleLocationSelect = (locationData: { lat: number; lng: number; address: string }) => {
    updateFormData({
      location: locationData.address,
      gpsLocation: { lat: locationData.lat, lng: locationData.lng }
    });
    setShowLocationPicker(false);
    toast({
      title: "Location Updated",
      description: "Study hall location has been updated successfully",
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.location || !formData.pricePerDay) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isAdmin && !formData.merchantId) {
      toast({
        title: "Error",
        description: "Please select a merchant",
        variant: "destructive",
      });
      return;
    }

    const finalData = {
      ...formData,
      qrCode: formData.qrCode || `${window.location.origin}/book/${Date.now()}`
    };

    onSubmit(finalData);
    onClose();
    
    toast({
      title: "Success",
      description: `Study hall ${editData ? 'updated' : 'created'} successfully`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editData ? 'Edit Study Hall' : 'Create New Study Hall'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            <BasicInformation
              formData={formData}
              updateFormData={updateFormData}
              merchants={merchants}
              loadingMerchants={loadingMerchants}
              isAdmin={isAdmin}
              onLocationPickerOpen={() => setShowLocationPicker(true)}
            />

            <PricingSection
              formData={formData}
              updateFormData={updateFormData}
            />

            <AmenitiesSection
              formData={formData}
              updateFormData={updateFormData}
              newAmenity={newAmenity}
              setNewAmenity={setNewAmenity}
            />

            <StatusSection
              formData={formData}
              updateFormData={updateFormData}
            />
          </div>

          {/* Right Column - Layout and Images */}
          <div className="space-y-6">
            <SeatLayoutDesigner
              rows={formData.rows}
              seatsPerRow={formData.seatsPerRow}
              layout={formData.layout}
              onLayoutChange={handleLayoutChange}
              onSeatStatusChange={handleSeatStatusChange}
            />

            <ImageUploadSection
              formData={formData}
              updateFormData={updateFormData}
            />

            <QRCodeSection
              formData={formData}
              updateFormData={updateFormData}
              onShowQRCode={() => setShowQRCode(true)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            {editData ? 'Update Study Hall' : 'Create Study Hall'}
          </Button>
        </div>

        {/* Google Maps Location Picker Modal */}
        <Dialog open={showLocationPicker} onOpenChange={setShowLocationPicker}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Study Hall Location</DialogTitle>
            </DialogHeader>
            <GoogleMapsLocationPicker
              initialLocation={{
                lat: formData.gpsLocation.lat,
                lng: formData.gpsLocation.lng,
                address: formData.location
              }}
              onLocationSelect={handleLocationSelect}
            />
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowLocationPicker(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* QR Code Modal */}
        {showQRCode && formData.qrCode && (
          <QRCodeDisplay
            qrCode={formData.qrCode}
            studyHallName={formData.name}
            onClose={() => setShowQRCode(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudyHallForm;
