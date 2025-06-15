import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Upload, X, Plus, Minus, QrCode, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SeatLayoutDesigner from './SeatLayoutDesigner';
import QRCodeDisplay from './QRCodeDisplay';
import GoogleMapsLocationPicker from './GoogleMapsLocationPicker';

interface StudyHallFormData {
  id?: number;
  name: string;
  merchantId: string;
  merchantName: string;
  location: string;
  gpsLocation: { lat: number; lng: number };
  rows: number;
  seatsPerRow: number;
  layout: Array<{ id: string; status: 'available' | 'occupied' | 'maintenance' | 'disabled' }>;
  pricePerDay: string;
  pricePerWeek: string;
  pricePerMonth: string;
  amenities: string[];
  customAmenities: string[];
  images: string[];
  mainImage: string;
  description: string;
  status: 'draft' | 'active' | 'inactive';
  qrCode?: string;
}

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
  const [formData, setFormData] = useState<StudyHallFormData>({
    name: '',
    merchantId: '',
    merchantName: '',
    location: '',
    gpsLocation: { lat: 28.6315, lng: 77.2167 },
    rows: 6,
    seatsPerRow: 8,
    layout: [],
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    amenities: [],
    customAmenities: [],
    images: [],
    mainImage: '',
    description: '',
    status: 'draft'
  });

  const [merchants] = useState([
    { id: 1, name: "Sneha Patel", businessName: "StudySpace Pro" },
    { id: 2, name: "Rajesh Kumar", businessName: "Quiet Zones" },
    { id: 3, name: "Amit Singh", businessName: "Tech Study Hub" }
  ]);

  const [newAmenity, setNewAmenity] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const { toast } = useToast();

  const defaultAmenities = ['AC', 'Wi-Fi', 'Parking', 'Power Outlets', 'Water Cooler', 'Washroom'];

  useEffect(() => {
    if (editData) {
      // Ensure all required properties exist with proper defaults
      setFormData({
        ...editData,
        amenities: editData.amenities || [],
        customAmenities: editData.customAmenities || [],
        images: editData.images || [],
        layout: editData.layout || [],
        pricePerDay: editData.pricePerDay?.toString() || '',
        pricePerWeek: editData.pricePerWeek?.toString() || '',
        pricePerMonth: editData.pricePerMonth?.toString() || '',
        merchantId: editData.merchantId?.toString() || '',
        status: editData.status || 'draft'
      });
    } else if (!isAdmin && currentMerchant) {
      setFormData(prev => ({
        ...prev,
        merchantId: currentMerchant.id.toString(),
        merchantName: currentMerchant.name
      }));
    }
  }, [editData, isAdmin, currentMerchant]);

  const generateSeatLayout = (rows: number, seatsPerRow: number) => {
    const layout = [];
    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(65 + i);
      for (let j = 1; j <= seatsPerRow; j++) {
        layout.push({
          id: `${rowLetter}${j}`,
          status: 'available' as const
        });
      }
    }
    return layout;
  };

  const handleLayoutChange = (rows: number, seatsPerRow: number) => {
    setFormData(prev => ({
      ...prev,
      rows,
      seatsPerRow,
      layout: generateSeatLayout(rows, seatsPerRow)
    }));
  };

  const handleSeatStatusChange = (seatId: string, status: 'available' | 'occupied' | 'maintenance' | 'disabled') => {
    setFormData(prev => ({
      ...prev,
      layout: prev.layout.map(seat =>
        seat.id === seatId ? { ...seat, status } : seat
      )
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim() && !formData.customAmenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        customAmenities: [...prev.customAmenities, newAmenity.trim()],
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeCustomAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      customAmenities: prev.customAmenities.filter(a => a !== amenity),
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
        mainImage: prev.mainImage || newImages[0]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        mainImage: prev.mainImage === prev.images[index] ? newImages[0] || '' : prev.mainImage
      };
    });
  };

  const generateQRCode = () => {
    const qrData = `${window.location.origin}/book/${Date.now()}`;
    setFormData(prev => ({ ...prev, qrCode: qrData }));
    setShowQRCode(true);
  };

  const handleLocationSelect = (locationData: { lat: number; lng: number; address: string }) => {
    setFormData(prev => ({
      ...prev,
      location: locationData.address,
      gpsLocation: { lat: locationData.lat, lng: locationData.lng }
    }));
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Study Hall Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter study hall name"
                    className="mt-1"
                  />
                </div>

                {isAdmin ? (
                  <div>
                    <Label htmlFor="merchant">Select Merchant *</Label>
                    <Select
                      value={formData.merchantId}
                      onValueChange={(value) => {
                        const merchant = merchants.find(m => m.id.toString() === value);
                        setFormData(prev => ({
                          ...prev,
                          merchantId: value,
                          merchantName: merchant ? merchant.name : ''
                        }));
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose merchant" />
                      </SelectTrigger>
                      <SelectContent>
                        {merchants.map(merchant => (
                          <SelectItem key={merchant.id} value={merchant.id.toString()}>
                            {merchant.name} - {merchant.businessName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <Label>Merchant</Label>
                    <Input
                      value={formData.merchantName}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="location">Location with GPS *</Label>
                  <div className="space-y-2 mt-1">
                    <Textarea
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter complete address"
                      rows={2}
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      GPS: {formData.gpsLocation.lat.toFixed(6)}, {formData.gpsLocation.lng.toFixed(6)}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLocationPicker(true)}
                      className="w-full"
                    >
                      🗺️ Select Location on Map
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your study hall..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="pricePerDay">Per Day (₹) *</Label>
                    <Input
                      id="pricePerDay"
                      type="number"
                      value={formData.pricePerDay}
                      onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                      placeholder="50"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerWeek">Per Week (₹)</Label>
                    <Input
                      id="pricePerWeek"
                      type="number"
                      value={formData.pricePerWeek}
                      onChange={(e) => setFormData(prev => ({ ...prev, pricePerWeek: e.target.value }))}
                      placeholder="300"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerMonth">Per Month (₹)</Label>
                    <Input
                      id="pricePerMonth"
                      type="number"
                      value={formData.pricePerMonth}
                      onChange={(e) => setFormData(prev => ({ ...prev, pricePerMonth: e.target.value }))}
                      placeholder="1000"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Amenities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {defaultAmenities.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={amenity} className="text-sm font-medium">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add custom amenity"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()}
                  />
                  <Button onClick={addCustomAmenity} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.customAmenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.customAmenities.map(amenity => (
                      <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                        {amenity}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomAmenity(amenity)}
                          className="h-4 w-4 p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Publication Status</Label>
                    <p className="text-sm text-gray-500">Control visibility of this study hall</p>
                  </div>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'active' | 'inactive') => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Layout and Images */}
          <div className="space-y-6">
            {/* Seat Layout Designer */}
            <SeatLayoutDesigner
              rows={formData.rows}
              seatsPerRow={formData.seatsPerRow}
              layout={formData.layout}
              onLayoutChange={handleLayoutChange}
              onSeatStatusChange={handleSeatStatusChange}
            />

            {/* Image Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-3"
                  />
                  <p className="text-sm text-gray-500">Upload multiple images. First image will be the main image.</p>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Study hall ${index + 1}`}
                          className={`w-full h-24 object-cover rounded-lg border-2 ${
                            image === formData.mainImage ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {image === formData.mainImage && (
                          <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.qrCode ? (
                  <div className="text-center space-y-3">
                    <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" onClick={() => setShowQRCode(true)}>
                        View QR Code
                      </Button>
                      <p className="text-xs text-gray-500">QR code will be generated after saving</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Button onClick={generateQRCode} variant="outline" className="w-full">
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Students can scan this to book directly</p>
                  </div>
                )}
              </CardContent>
            </Card>
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
