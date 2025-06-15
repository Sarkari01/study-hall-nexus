
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { StudyHallFormData } from "@/hooks/useStudyHallForm";

interface AmenitiesSectionProps {
  formData: StudyHallFormData;
  updateFormData: (updates: Partial<StudyHallFormData>) => void;
  newAmenity: string;
  setNewAmenity: (value: string) => void;
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  formData,
  updateFormData,
  newAmenity,
  setNewAmenity
}) => {
  const defaultAmenities = ['AC', 'Wi-Fi', 'Parking', 'Power Outlets', 'Water Cooler', 'Washroom'];

  const handleAmenityToggle = (amenity: string) => {
    const updatedAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    
    updateFormData({ amenities: updatedAmenities });
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim() && !formData.customAmenities.includes(newAmenity.trim())) {
      updateFormData({
        customAmenities: [...formData.customAmenities, newAmenity.trim()],
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const removeCustomAmenity = (amenity: string) => {
    updateFormData({
      customAmenities: formData.customAmenities.filter(a => a !== amenity),
      amenities: formData.amenities.filter(a => a !== amenity)
    });
  };

  return (
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
  );
};

export default AmenitiesSection;
