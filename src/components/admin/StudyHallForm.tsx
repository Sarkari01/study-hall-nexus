
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Upload, X, Plus, Clock, DollarSign, Users, Wifi, Car, Coffee, Power, BookOpen, Shield, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SeatLayoutDesigner from './SeatLayoutDesigner';
import ImageUploader from '@/components/shared/ImageUploader';

interface StudyHallFormData {
  id?: number;
  name: string;
  merchantId: string;
  description: string;
  location: string;
  gpsLocation: { lat: number; lng: number };
  capacity: number;
  rows: number;
  seatsPerRow: number;
  layout: string[];
  pricePerDay: string;
  pricePerWeek: string;
  pricePerMonth: string;
  amenities: string[];
  customAmenities: string[];
  status: 'draft' | 'active' | 'inactive';
  images: string[];
  mainImage: string;
  operatingHours: {
    open: string;
    close: string;
    days: string[];
  };
}

interface StudyHallFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudyHallFormData) => void;
  editData?: StudyHallFormData | null;
  isAdmin?: boolean;
}

const StudyHallForm: React.FC<StudyHallFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
  isAdmin = false
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<StudyHallFormData>({
    name: '',
    merchantId: '',
    description: '',
    location: '',
    gpsLocation: { lat: 0, lng: 0 },
    capacity: 30,
    rows: 5,
    seatsPerRow: 6,
    layout: [],
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    amenities: [],
    customAmenities: [],
    status: 'draft',
    images: [],
    mainImage: '',
    operatingHours: {
      open: '09:00',
      close: '21:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    }
  });

  const predefinedAmenities = [
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'coffee', label: 'Coffee/Tea', icon: Coffee },
    { id: 'power', label: 'Power Outlets', icon: Power },
    { id: 'library', label: 'Library Access', icon: BookOpen },
    { id: 'security', label: '24/7 Security', icon: Shield },
    { id: 'cctv', label: 'CCTV Monitoring', icon: Camera }
  ];

  const mockMerchants = [
    { id: '1', name: 'Sneha Patel - StudySpace Pro' },
    { id: '2', name: 'Rajesh Kumar - Quiet Zones' },
    { id: '3', name: 'Amit Singh - Tech Study Hub' }
  ];

  const weekDays = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        name: '',
        merchantId: '',
        description: '',
        location: '',
        gpsLocation: { lat: 0, lng: 0 },
        capacity: 30,
        rows: 5,
        seatsPerRow: 6,
        layout: [],
        pricePerDay: '',
        pricePerWeek: '',
        pricePerMonth: '',
        amenities: [],
        customAmenities: [],
        status: 'draft',
        images: [],
        mainImage: '',
        operatingHours: {
          open: '09:00',
          close: '21:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        }
      });
    }
  }, [editData, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleCustomAmenityAdd = (amenity: string) => {
    if (amenity.trim() && !formData.customAmenities.includes(amenity.trim())) {
      setFormData(prev => ({
        ...prev,
        customAmenities: [...prev.customAmenities, amenity.trim()]
      }));
    }
  };

  const handleCustomAmenityRemove = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      customAmenities: prev.customAmenities.filter(a => a !== amenity)
    }));
  };

  const handleLayoutUpdate = (layout: string[]) => {
    setFormData(prev => ({
      ...prev,
      layout,
      capacity: layout.length
    }));
  };

  const handleImagesUpdate = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images,
      mainImage: images.length > 0 && !prev.mainImage ? images[0] : prev.mainImage
    }));
  };

  const handleOperatingHoursChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [field]: value
      }
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        days: prev.operatingHours.days.includes(day)
          ? prev.operatingHours.days.filter(d => d !== day)
          : [...prev.operatingHours.days, day]
      }
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Study hall name is required", variant: "destructive" });
      return false;
    }
    if (isAdmin && !formData.merchantId) {
      toast({ title: "Error", description: "Please select a merchant", variant: "destructive" });
      return false;
    }
    if (!formData.location.trim()) {
      toast({ title: "Error", description: "Location is required", variant: "destructive" });
      return false;
    }
    if (!formData.pricePerDay || parseFloat(formData.pricePerDay) <= 0) {
      toast({ title: "Error", description: "Valid price per day is required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        pricePerDay: parseFloat(formData.pricePerDay),
        pricePerWeek: formData.pricePerWeek ? parseFloat(formData.pricePerWeek) : 0,
        pricePerMonth: formData.pricePerMonth ? parseFloat(formData.pricePerMonth) : 0,
        merchantId: parseInt(formData.merchantId)
      };

      await onSubmit(dataToSubmit);
      toast({ title: "Success", description: `Study hall ${editData ? 'updated' : 'created'} successfully` });
      onClose();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save study hall", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Study Hall' : 'Add New Study Hall'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="layout">Layout & Seats</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="media">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Study Hall Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter study hall name"
                />
              </div>
              
              {isAdmin && (
                <div>
                  <Label htmlFor="merchant">Merchant *</Label>
                  <Select value={formData.merchantId} onValueChange={(value) => handleInputChange('merchantId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select merchant" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMerchants.map(merchant => (
                        <SelectItem key={merchant.id} value={merchant.id}>
                          {merchant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your study hall..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter complete address"
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Operating Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Opening Time</Label>
                    <Input
                      type="time"
                      value={formData.operatingHours.open}
                      onChange={(e) => handleOperatingHoursChange('open', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Closing Time</Label>
                    <Input
                      type="time"
                      value={formData.operatingHours.close}
                      onChange={(e) => handleOperatingHoursChange('close', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Operating Days</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {weekDays.map(day => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.id}
                          checked={formData.operatingHours.days.includes(day.id)}
                          onCheckedChange={() => handleDayToggle(day.id)}
                        />
                        <Label htmlFor={day.id} className="text-sm">{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rows">Number of Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.rows}
                  onChange={(e) => handleInputChange('rows', parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label htmlFor="seatsPerRow">Seats per Row</Label>
                <Input
                  id="seatsPerRow"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.seatsPerRow}
                  onChange={(e) => handleInputChange('seatsPerRow', parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label>Total Capacity</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{formData.capacity} seats</span>
                </div>
              </div>
            </div>

            <SeatLayoutDesigner
              rows={formData.rows}
              seatsPerRow={formData.seatsPerRow}
              layout={formData.layout}
              onLayoutChange={handleLayoutUpdate}
            />
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pricePerDay">Price per Day (₹) *</Label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <Input
                    id="pricePerDay"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerDay}
                    onChange={(e) => handleInputChange('pricePerDay', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="pricePerWeek">Price per Week (₹)</Label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <Input
                    id="pricePerWeek"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerWeek}
                    onChange={(e) => handleInputChange('pricePerWeek', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="pricePerMonth">Price per Month (₹)</Label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <Input
                    id="pricePerMonth"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerMonth}
                    onChange={(e) => handleInputChange('pricePerMonth', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Pricing Guidelines:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Daily rate is mandatory and forms the base pricing</li>
                    <li>Weekly and monthly rates are optional but recommended for better deals</li>
                    <li>Consider offering discounts for longer duration bookings</li>
                    <li>Price should include basic amenities like seating and lighting</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-4">
            <div>
              <Label>Standard Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {predefinedAmenities.map(amenity => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={formData.amenities.includes(amenity.id)}
                        onCheckedChange={() => handleAmenityToggle(amenity.id)}
                      />
                      <IconComponent className="h-4 w-4 text-gray-500" />
                      <Label htmlFor={amenity.id} className="text-sm">{amenity.label}</Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>Custom Amenities</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  placeholder="Add custom amenity"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomAmenityAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add custom amenity"]') as HTMLInputElement;
                    if (input) {
                      handleCustomAmenityAdd(input.value);
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.customAmenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.customAmenities.map(amenity => (
                    <Badge key={amenity} variant="secondary" className="flex items-center space-x-1">
                      <span>{amenity}</span>
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleCustomAmenityRemove(amenity)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div>
              <Label>Study Hall Images</Label>
              <p className="text-sm text-gray-500 mb-3">
                Upload images of your study hall. The first image will be used as the main image.
              </p>
              <ImageUploader
                currentImages={formData.images}
                onImagesChange={handleImagesUpdate}
                maxImages={10}
                acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
              />
            </div>

            {formData.images.length > 0 && (
              <div>
                <Label>Main Image</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {formData.images.map(image => (
                    <div
                      key={image}
                      className={`relative cursor-pointer border-2 rounded-lg overflow-hidden ${
                        formData.mainImage === image ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      onClick={() => handleInputChange('mainImage', image)}
                    >
                      <img src={image} alt="Study hall" className="w-full h-24 object-cover" />
                      {formData.mainImage === image && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <Badge className="bg-blue-500">Main</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : editData ? 'Update Study Hall' : 'Create Study Hall'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudyHallForm;
